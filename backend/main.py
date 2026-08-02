from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from reportlab.pdfgen import canvas

from database import SessionLocal, engine
from models import Base, ResumeAnalysis

import pdfplumber
import re
import pandas as pd

# Create Tables
Base.metadata.create_all(bind=engine)

# FastAPI App
app = FastAPI(
    title="AI Resume Analyzer",
    version="1.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Required Skills
REQUIRED_SKILLS = [
    "Python",
    "SQL",
    "PostgreSQL",
    "FastAPI",
    "Git",
    "Docker",
    "AWS"
]

# Home Route
@app.get("/")
def home():
    return {
        "message": "Welcome to AI Resume Analyzer"
    }

# Database Test
@app.get("/db-test")
def db_test():
    return {
        "message": "Database Connected Successfully"
    }

# Analyze Resume
@app.post("/analyze-resume")
def analyze_resume(file: UploadFile = File(...)):
    try:
        text = ""

        with pdfplumber.open(file.file) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()

                if page_text:
                    text += page_text + "\n"

        # Name
        lines = [line.strip() for line in text.split("\n") if line.strip()]
        name = lines[0] if lines else "Not Found"

        # Email
        email_match = re.search(
            r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
            text
        )

        email = email_match.group() if email_match else "Not Found"

        # Phone
        phone_match = re.search(
            r"(\+91[- ]?)?[6-9]\d{9}",
            text
        )

        phone = phone_match.group() if phone_match else "Not Found"

        # Skills Found
        found_skills = []

        for skill in REQUIRED_SKILLS:
            if skill.lower() in text.lower():
                found_skills.append(skill)

        # Missing Skills
        missing_skills = []

        for skill in REQUIRED_SKILLS:
            if skill not in found_skills:
                missing_skills.append(skill)

        # ATS Score
        ats_score = int(
            (len(found_skills) / len(REQUIRED_SKILLS)) * 100
        )

        # Suggestions
        suggestions = []

        if ats_score < 60:
            suggestions.append(
                "Add more technical skills to improve ATS score"
            )

        if email == "Not Found":
            suggestions.append(
                "Add a professional email address"
            )

        if phone == "Not Found":
            suggestions.append(
                "Add a contact number"
            )

        # Save to Database
        db = SessionLocal()

        resume = ResumeAnalysis(
            name=name,
            email=email,
            phone=phone,
            ats_score=ats_score,
            skills=", ".join(found_skills)
        )

        db.add(resume)
        db.commit()
        db.close()

        return {
            "name": name,
            "email": email,
            "phone": phone,
            "ats_score": ats_score,
            "skills": found_skills,
            "missing_skills": missing_skills,
            "suggestions": suggestions
        }

    except Exception as e:
        return {
            "error": str(e)
        }

# Get All Resumes
@app.get("/resumes")
def get_resumes():

    db = SessionLocal()

    resumes = db.query(ResumeAnalysis).all()

    result = []

    for resume in resumes:
        result.append({
            "id": resume.id,
            "name": resume.name,
            "email": resume.email,
            "phone": resume.phone,
            "ats_score": resume.ats_score,
            "skills": resume.skills
        })

    db.close()

    return result

# Dashboard
@app.get("/dashboard")
def dashboard():

    db = SessionLocal()

    resumes = db.query(ResumeAnalysis).all()

    total_resumes = len(resumes)

    if total_resumes == 0:
        db.close()
        return {
            "total_resumes": 0,
            "average_ats": 0,
            "highest_ats": 0,
            "lowest_ats": 0
        }

    scores = [resume.ats_score for resume in resumes]

    db.close()

    return {
        "total_resumes": total_resumes,
        "average_ats": round(sum(scores) / total_resumes, 2),
        "highest_ats": max(scores),
        "lowest_ats": min(scores)
    }

# Top Candidates
@app.get("/top-candidates")
def top_candidates():

    db = SessionLocal()

    resumes = (
        db.query(ResumeAnalysis)
        .order_by(ResumeAnalysis.ats_score.desc())
        .limit(10)
        .all()
    )

    result = []

    for resume in resumes:
        result.append({
            "id": resume.id,
            "name": resume.name,
            "email": resume.email,
            "phone": resume.phone,
            "ats_score": resume.ats_score,
            "skills": resume.skills
        })

    db.close()

    return result

# Candidate Details
@app.get("/candidate/{candidate_id}")
def get_candidate(candidate_id: int):

    db = SessionLocal()

    candidate = (
        db.query(ResumeAnalysis)
        .filter(ResumeAnalysis.id == candidate_id)
        .first()
    )

    db.close()

    if not candidate:
        return {"error": "Candidate not found"}

    return {
        "id": candidate.id,
        "name": candidate.name,
        "email": candidate.email,
        "phone": candidate.phone,
        "ats_score": candidate.ats_score,
        "skills": candidate.skills
    }

# Generate PDF Report
@app.get("/generate-report/{resume_id}")
def generate_report(resume_id: int):

    db = SessionLocal()

    resume = (
        db.query(ResumeAnalysis)
        .filter(ResumeAnalysis.id == resume_id)
        .first()
    )

    db.close()

    if not resume:
        return {"error": "Resume not found"}

    filename = f"resume_report_{resume_id}.pdf"

    pdf = canvas.Canvas(filename)

    pdf.drawString(100, 800, "AI Resume Analyzer Report")
    pdf.drawString(100, 760, f"Name: {resume.name}")
    pdf.drawString(100, 740, f"Email: {resume.email}")
    pdf.drawString(100, 720, f"Phone: {resume.phone}")
    pdf.drawString(100, 700, f"ATS Score: {resume.ats_score}")
    pdf.drawString(100, 680, f"Skills: {resume.skills}")

    pdf.save()

    return FileResponse(
        filename,
        media_type="application/pdf",
        filename=filename
    )

# Export Excel
@app.get("/export-excel")
def export_excel():

    db = SessionLocal()

    resumes = db.query(ResumeAnalysis).all()

    data = []

    for resume in resumes:
        data.append({
            "ID": resume.id,
            "Name": resume.name,
            "Email": resume.email,
            "Phone": resume.phone,
            "ATS Score": resume.ats_score,
            "Skills": resume.skills
        })

    db.close()

    df = pd.DataFrame(data)

    filename = "candidates.xlsx"

    df.to_excel(filename, index=False)

    return FileResponse(
        filename,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename=filename
    )

# Delete Candidate
@app.delete("/delete-candidate/{candidate_id}")
def delete_candidate(candidate_id: int):

    db = SessionLocal()

    candidate = (
        db.query(ResumeAnalysis)
        .filter(ResumeAnalysis.id == candidate_id)
        .first()
    )

    if not candidate:
        db.close()
        return {"message": "Candidate not found"}

    db.delete(candidate)
    db.commit()
    db.close()

    return {"message": "Candidate deleted successfully"}