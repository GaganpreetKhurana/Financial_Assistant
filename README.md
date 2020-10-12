# Financial_Assistant
Minor Project

[Summary](https://docs.google.com/document/d/e/2PACX-1vTOTM-U3jg__7pfAhukVKwP5QTQv3WoCXxfo-fjr5FjjX2IrqEN7Tc0SAIHljEXob_cXVm-KZLrUgwe/pub)

## Requirements
<ul>
<li><a href="https://www.python.org/downloads/release/python-379/">Python 3.7</a></li>
<li><a href="https://www.npmjs.com/get-npm">npm 6.14.7</a></li>
</ul>

## Run Instructions
<ol>
    <li>Clone the repository.</li>
    <li>Run the backend and the frontend server to start the project.
    <ul>
    <li><h3>Batch Scripts</h3>
    <ul>
        <li>
            <b>SETUP</b>
            - Run <code>install_requirements.bat</code> to setup the environment and install necessary packages.</li>
        <li>
            <b>RUN</b> 
            - Run <code>donna.bat</code> to start the servers. Wait for the browser to open.</li>
    </ul></li>
        <li><h3>Command Line </h3>
        Open 2 terminal windows/tabs.
        <ul>
            <li><h4>Backend</h4>
            <ol>
              <li>Give command <code> pip install -r requirements.txt</code> to install the required dependencies.</li>
              <li>Change directory to backend  <code>cd backend</code></li>
              <li>Give command <code>python manage.py runserver</code> to run the backend server. </li>
            </ol></li>
            <li><h4>Frontend</h4>
            <ol>
              <li>Change directory to frontend  <code>cd frontend</code></li>
              <li>Give command <code>npm install</code> to install the required dependencies.</li>
              <li>Give command <code>npm start</code> to run the frontend server and this will automatically start the app in the browser. </li>
            </ol></li>
        </ul></li>
    </ul></li>
</ol>   
