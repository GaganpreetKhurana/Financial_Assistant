.DEFAULT_GOAL := run
install:
	bash -c "pip3 install -r requirements.txt"
	bash -c "python3 setup.py"

django:
	bash -c "sleep .5"
	bash -c "echo Frontend"
	bash -c "python3 -d backend/manage.py runserver"

react:
	bash -c "sleep .5"
	bash -c "echo Backend"
	bash -c "cd frontend && npm start"

run:
	make django & make react
