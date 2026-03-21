@if "%SCM_TRACE_ON%" == "4" @echo on

setlocal enabledelayedexpansion

REM ----------------------
REM KUDU Deployment Script
REM Version: 1.0.0
REM ----------------------

REM Specify the commit we're deploying
if not defined DEPLOYMENT_SOURCE (
  set DEPLOYMENT_SOURCE=!CD!
)

if not defined DEPLOYMENT_TARGET (
  set DEPLOYMENT_TARGET=!DEPLOYMENT_SOURCE!
)

if not defined NEXT_MANIFEST_PATH (
  set NEXT_MANIFEST_PATH=!DEPLOYMENT_TARGET!\manifest
)

if not defined KUDU_SYNC_CMD (
  REM Install kudu sync
  echo Kudu Sync Command not defined
)

REM Npm, then call npm install for all deployment steps.
if exist "!DEPLOYMENT_SOURCE!\package.json" (
  call :ExecuteCmd !NPM_CMD! --version
  IF !ERRORLEVEL! NEQ 0 goto error
  
  REM if ___ check is done - use npm ci instead of npm install
  call :ExecuteCmd !NPM_CMD! install --production
  IF !ERRORLEVEL! NEQ 0 goto error
)

REM Build Next.js application
if exist "!DEPLOYMENT_SOURCE!\next.config.js" (
  call :ExecuteCmd !NPM_CMD! run build
  IF !ERRORLEVEL! NEQ 0 goto error
)

REM KuduSync is required for function app. If not available, skip syncing
if defined KUDU_SYNC_CMD (
  call :ExecuteCmd "%KUDU_SYNC_CMD%" -v 50 -f "!DEPLOYMENT_SOURCE!" -t "!DEPLOYMENT_TARGET!" -n "!NEXT_MANIFEST_PATH!" -p "node_modules|.git|README.md|.gitignore|.deployment|deploy.cmd"
  IF !ERRORLEVEL! NEQ 0 goto error
)

REM Post deployment stub
if exist "!DEPLOYMENT_SOURCE!\PostDeploymentActions" (
  call "!DEPLOYMENT_SOURCE!\PostDeploymentActions\PostDeploymentActions.cmd"
)

goto end

:ExecuteCmd
setlocal
set _CMD_=%*
call %_CMD_%
if "%ERRORLEVEL%" NEQ "0" (
  popd
  goto error
)
endlocal
goto :eof

:error
endlocal
echo An error has occurred during web site deployment.
call :exitSetErrorLevel
call :exitFromFunction 2>nul

:exitSetErrorLevel
exit /b 1

:exitFromFunction
()
