from pydantic import BaseModel

class ResumeResponse(BaseModel):
    name: str
    email: str
    phone: str
    ats_score: int
    skills: list[str]