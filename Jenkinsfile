#!groovy
PROJECT_NAME = "${currentBuild.rawBuild.project.parent.displayName.toLowerCase()}"
BRANCH_NAME = "${env.BRANCH_NAME.replaceAll(/[\/]/, '-').toLowerCase()}"

pipeline {
  agent any

  tools {
    nodejs 'NodeJS 7.4.0'
  }

  stages {
    stage("Build Image and Publish to Nexus") {
      steps {
        script {
          //def image = docker.build "${PROJECT_NAME}:${BRANCH_NAME}-${env.BUILD_ID}" // https://issues.jenkins-ci.org/browse/JENKINS-31507
          sh "docker build . -t ${PROJECT_NAME}:${BRANCH_NAME}-${env.BUILD_ID}  -f WebUI.Dockerfile"
          def image = docker.image("${PROJECT_NAME}:${BRANCH_NAME}-${env.BUILD_ID}")
          docker.withRegistry("https://${env.NEXUS_DEV_DOCKER_REGISTRY}", 'NEXUS_AUTH') {
            image.push()
          }
        }
      }
    }

    stage("Deploy to Openshift") {
      steps {
        script {
          service_name = "${PROJECT_NAME}-${BRANCH_NAME}"
          try {
            withCredentials([usernamePassword(credentialsId: 'OCP_AUTH', usernameVariable: 'OCP_USERNAME', passwordVariable: 'OCP_PASSWORD')]) {
              sh """
                oc login ${env.OPENSHIFT_API_URL} --username ${OCP_USERNAME} --password ${OCP_PASSWORD} --insecure-skip-tls-verify
                oc project ${env.OCP_ACMF_NS}
                oc process -f openshift_template.yaml -p NAMESPACE=${env.OCP_ACMF_NS} -p REGISTRY=${env.NEXUS_DEV_DOCKER_REGISTRY} -p IMAGE_NAME=${PROJECT_NAME} -p IMAGE_TAG=${BRANCH_NAME}-${env.BUILD_ID} -p SERVICE_NAME=${service_name} | oc apply -f - -n ${env.OCP_ACMF_NS}
                oc import-image ${service_name} --confirm --insecure | grep -i "successfully"
              """
            }
          } catch(e) {
            error(e)
          }
        }
      }
    }
  }
}
