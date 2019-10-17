# Simple Express Api Mock Server

## Adding Routes
- create a new json file under routes directory (just follow the sample json files in the repo)
- start the server using `npm start`

## Route Sample File

1. Responds to `http://localhost:9090/api2` and returns `{"default": "message"}`. 
```json
{
  "path": "/api2",
  "port": 9090,
  "response": {
    "default": "message"
  }
}
```

2. Responds to the following:
   - `http://localhost:5050/dashboard/stats?type=1` and returns `{"someKey": "someValue"}`
   - `http://localhost:5050/dashboard/stats?type=2` and returns `{"someKey": "someOtherValue"}`
   - `http://localhost:5050/dashboard/stats` and returns `{"default": "message"}`
```json
{
  "path": "/dashboard/stats",
  "port": 5050,
  "queries": [
    {
      "params": {"type": "1"},
      "response": {
        "someKey": "someValue"
      }
    },
    {
      "params": {"type": "2"},
      "response": {
        "someKey": "someOtherValue"
      }
    }
  ],
  "response": {
    "default": "message"
  }
}
```

## Repository Forks

If you guys fork this project for improvements, please do send me a merge request so that this sample project is also updated for the benefit of other devs.