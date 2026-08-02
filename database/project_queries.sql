-- =====================================
-- AI Resume Analyzer SQL Queries
-- =====================================

-- 1. View All Candidates
SELECT * 
FROM resume_analysis;

-- 2. Top 10 Candidates by ATS Score
SELECT *
FROM resume_analysis
ORDER BY ats_score DESC
LIMIT 10;

-- 3. Total Number of Resumes
SELECT COUNT(*) AS total_resumes
FROM resume_analysis;

-- 4. Average ATS Score
SELECT ROUND(AVG(ats_score), 2) AS average_ats
FROM resume_analysis;

-- 5. Highest ATS Score
SELECT MAX(ats_score) AS highest_ats
FROM resume_analysis;

-- 6. Lowest ATS Score
SELECT MIN(ats_score) AS lowest_ats
FROM resume_analysis;

-- 7. Candidates With ATS Above 80
SELECT *
FROM resume_analysis
WHERE ats_score > 80;

-- 8. Candidates With ATS Between 60 and 80
SELECT *
FROM resume_analysis
WHERE ats_score BETWEEN 60 AND 80;

-- 9. Search Candidate By Name
SELECT *
FROM resume_analysis
WHERE name ILIKE '%Yash%';

-- 10. Search Candidate By Email
SELECT *
FROM resume_analysis
WHERE email ILIKE '%gmail%';

-- 11. Count Candidates Above 70 ATS
SELECT COUNT(*) AS qualified_candidates
FROM resume_analysis
WHERE ats_score >= 70;

-- 12. ATS Score Category
SELECT
    name,
    ats_score,
    CASE
        WHEN ats_score >= 80 THEN 'Excellent'
        WHEN ats_score >= 60 THEN 'Good'
        ELSE 'Needs Improvement'
    END AS rating
FROM resume_analysis;

-- 13. Rank Candidates
SELECT
    id,
    name,
    ats_score,
    RANK() OVER (
        ORDER BY ats_score DESC
    ) AS candidate_rank
FROM resume_analysis;

-- 14. Top 5 Candidates
SELECT
    id,
    name,
    email,
    ats_score
FROM resume_analysis
ORDER BY ats_score DESC
LIMIT 5;

-- 15. Candidates Missing Email
SELECT *
FROM resume_analysis
WHERE email IS NULL
   OR email = 'Not Found';

-- 16. Candidates Missing Phone
SELECT *
FROM resume_analysis
WHERE phone IS NULL
   OR phone = 'Not Found';

-- 17. ATS Distribution Report
SELECT
    CASE
        WHEN ats_score >= 80 THEN 'Excellent'
        WHEN ats_score >= 60 THEN 'Good'
        ELSE 'Poor'
    END AS category,
    COUNT(*) AS total_candidates
FROM resume_analysis
GROUP BY category;

-- 18. Candidate Skills Report
SELECT
    name,
    skills
FROM resume_analysis
ORDER BY name;

-- 19. Export Ready Dataset
SELECT
    id,
    name,
    email,
    phone,
    ats_score,
    skills
FROM resume_analysis
ORDER BY ats_score DESC;

-- 20. Dashboard Query
SELECT
    COUNT(*) AS total_resumes,
    ROUND(AVG(ats_score),2) AS average_ats,
    MAX(ats_score) AS highest_ats,
    MIN(ats_score) AS lowest_ats
FROM resume_analysis;