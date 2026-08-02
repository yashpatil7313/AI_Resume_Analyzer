from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class ResumeAnalysis(Base):
    __tablename__ = "resume_analysis"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100))
    email = Column(String(100))
    phone = Column(String(20))
    ats_score = Column(Integer)
    skills = Column(String(500))