title DONNA
echo Installing requirements
cd frontend
start npm install
cd ..
echo Installing Frontend Requirements
python -m pip install --upgrade pip
python -m pip install virtualenv
python -m venv backend/venv
call backend\venv\Scripts\activate.bat
python -m pip install --upgrade pip
pip install -r requirements.txt
python setup.py
echo Backend Requirements Installed
pause
