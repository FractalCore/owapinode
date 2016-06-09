# owapinode
An overwatch API built in Node.JS

# Current Endpoints:

### `GET /api/v1/user/:battletag`

**Get the basic stats of a user.**

Like all API requests, this will automatically determine the region of the user.

*Example:*

```
$ http GET "https://owapi.fractalcore.net/api/v1/user/crdnl-1601"
```

*Result:*
```
{
    "battlenetID": "crdnl-1601",
    "level": "26",
    "games": "124",
    "gamesWon": "54",
    "averages": {
        "eliminations": "5.87",
        "damage": "2,166",
        "deaths": "7.86",
        "finalBlows": "3.2",
        "healing": "2,497",
        "objKills": "2.08",
        "objTime": "00:38",
        "soloKills": "1.06"
    }
}
```