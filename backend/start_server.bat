@echo off
echo Starting GreenView AR Backend Server...
echo.
echo Make sure you have installed dependencies:
echo   pip install -r requirements.txt
echo.
python -m uvicorn main:app --reload
pause

