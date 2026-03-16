pipeline {
    agent any

    stages {

        stage('Clone Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/Kiransekarc/Devops-SuperMarket-Project.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '/usr/local/bin/docker compose build'
            }
        }

        stage('Run Containers') {
            steps {
                sh '/usr/local/bin/docker compose down || true'
                sh '/usr/local/bin/docker compose up -d'
            }
        }

    }
}
