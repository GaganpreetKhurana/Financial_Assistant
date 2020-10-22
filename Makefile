.DEFAULT_GOAL := run	
install:
	bash -c "pip3 install --upgrade pip"
	bash -c "pip3 install virtualenv"
	bash -c "pip3 install -r requirements.txt"
	bash -c "python3 setup.py"
	bash -c "source backend/venv/bin/activate"
	bash -c "cd frontend && npm install"
	bash -c "echo Installation complete"

django:
	bash -c "sleep .5"
	bash -c "echo Backend"
	bash -c "python3 -d backend/manage.py runserver"

react:
	bash -c "sleep .5"
	bash -c "echo Frontend"
	bash -c "cd frontend && npm start"

run:
	make django & make react
