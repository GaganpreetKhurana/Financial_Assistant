title "DONNA"
echo "Starting Servers"
cd frontend
start npm start
cd ..
echo "Frontend Server Started"
echo "Starting Backend Server"
call backend\venv\Scripts\activate.bat
python backend\manage.py runserver
pause