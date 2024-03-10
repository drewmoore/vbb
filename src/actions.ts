'use server'

import axios, { AxiosError } from "axios"

import { ApiResponse } from "./types"

type VbbJourneyLeg = {
  origin: { id: number, type: string, name: string, address: string };
  destination: { id: number, type: string, name: string, address: string };
}

type VbbJourney = {
  refreshToken: string;
  legs: Array<VbbJourneyLeg>;
}

type VbbJourneysResponse = {
  journeys: Array<VbbJourney>;
}

export async function search(_formState: ApiResponse<VbbJourneysResponse>, formData: FormData): Promise<ApiResponse<VbbJourneysResponse>> {
  try {
    const from = JSON.parse(formData.get("from"))
    const to = JSON.parse(formData.get("to"))

    // https://v6.vbb.transport.rest/api.html#get-journeys
    // https://v6.vbb.transport.rest/journeys?from=900023201&to.id=900980720&to.name=ATZE+Musiktheater&to.latitude=52.54333&to.longitude=13.35167
    const results = await axios.get(
      "https://v6.vbb.transport.rest/journeys",
      {
        // Params seem to need to be in this specific format.
        // See also https://github.com/public-transport/hafas-client/blob/6/docs/journeys.md
        params: {
          "from.type": "location",
          "from.address": from.address,
          "from.latitude": from.latitude,
          "from.longitude": from.longitude,
          "to.type": "location",
          "to.address": to.address,
          "to.latitude": to.latitude,
          "to.longitude": to.longitude,
        }
      }
    )

    // Object.keys(results.data)
    //   [ "earlierRef", "laterRef", "journeys", "realtimeDataUpdatedAt" ]
    //    earlierRef: string
    //    laterRef: string
    //    journeys: array of objects
    //    realtimeDataUpdatedAt: number (timestamp since epoch?)

    // Object.keys(results.data.journeys[0])
    //   [ "type", "legs", "refreshToken", "cycle" ]
    //    type: string ("journey")
    //    legs: array of objects
    //    refreshToken: string (can use to get same journey again, although lifespan of token uncertain...)
    //    cycle: object ({ min: 240 } in this case...)

    // Object.keys(results.data.journeys[0].legs[0])
    /*
         [
            "origin",
            "destination",
            "departure",
            "plannedDeparture",
            "departureDelay",
            "arrival",
            "plannedArrival",
            "arrivalDelay",
            "public",
            "walking",
            "distance"
          ]
    */

    // Object.keys(formState.data.journeys[0].legs[0].origin)
    //   [ "type", "id", "latitude", "longitude", "address" ]
    /*
           {
              "type": "location",
              "id": "9721490",
              "latitude": 12.12345,
              "longitude": 12.123345,
              "address": "12345 Berlin-Mitte, Street-name 123"
            }
    */

    // formState.data.journeys[0].legs[0].destination
    /*
            {
              "type": "stop",
              "id": "900009103",
              "name": "U Seestr. (Berlin)",
              "location": {
                "type": "location",
                "id": "900009103",
                "latitude": 52.550471,
                "longitude": 13.351966
              },
              "products": {
                "suburban": false,
                "subway": true,
                "tram": true,
                "bus": true,
                "ferry": false,
                "express": false,
                "regional": false
              },
              "stationDHID": "de:11000:900009103"
            }
    */

    // formState.data.journeys[0].legs[0].departure 
    //   "2024-02-26T17:44:00+01:00"

    // formState.data.journeys[0].legs[0].plannedDeparture 
    //   "2024-02-26T17:44:00+01:00"

    // formState.data.journeys[0].legs[0].departureDelay
    //    null (maybe because no delay?)

    // formState.data.journeys[0].legs[0].arrival 
    //    "2024-02-26T17:56:00+01:00"

    // formState.data.journeys[0].legs[0].plannedArrival 
    //    "2024-02-26T17:56:00+01:00"

    // formState.data.journeys[0].legs[0].arrivalDelay 
    //    null (maybe because no delay?)

    // formState.data.journeys[0].legs[0].public 
    //     true (|| undefined in many legs)

    // formState.data.journeys[0].legs[0].walking 
    //    true (seems that legs are indicated as walking or undefined based on whether walking directions or leg of transport journey...)

    // formState.data.journeys[0].legs[0].distance 
    //    835 (number)


    // NOTE: other type of journey leg:
    // Object.keys(formState.data.journeys[0].legs[1])
    /*
      [
        "origin",
        "destination",
        "departure",
        "plannedDeparture",
        "departureDelay",
        "arrival",
        "plannedArrival",
        "arrivalDelay",
        "reachable",
        "tripId",
        "line",
        "direction",
        "arrivalPlatform",
        "plannedArrivalPlatform",
        "arrivalPrognosisType",
        "departurePlatform",
        "plannedDeparturePlatform",
        "departurePrognosisType",
        "remarks",
        "cycle"
      ]
    */
   // TODO: map rest of object tree and types for legs[1] (for stops as opposed to walking directions, some significant differences...)


   /*
   {
  "type": "journey",
  "legs": [
    {
      "origin": {
        "type": "location",
        "id": "9721490",
        "latitude": 123.549788,
        "longitude": 123.342707,
        "address": "12345 Berlin-Mitte, Streetname 123"
      },
      "destination": {
        "type": "stop",
        "id": "900009103",
        "name": "U Seestr. (Berlin)",
        "location": {
          "type": "location",
          "id": "900009103",
          "latitude": 52.550471,
          "longitude": 13.351966
        },
        "products": {
          "suburban": false,
          "subway": true,
          "tram": true,
          "bus": true,
          "ferry": false,
          "express": false,
          "regional": false
        },
        "stationDHID": "de:11000:900009103"
      },
      "departure": "2024-02-26T17:44:00+01:00",
      "plannedDeparture": "2024-02-26T17:44:00+01:00",
      "departureDelay": null,
      "arrival": "2024-02-26T17:56:00+01:00",
      "plannedArrival": "2024-02-26T17:56:00+01:00",
      "arrivalDelay": null,
      "public": true,
      "walking": true,
      "distance": 835
    },
    {
      "origin": {
        "type": "stop",
        "id": "900009103",
        "name": "U Seestr. (Berlin)",
        "location": {
          "type": "location",
          "id": "900009103",
          "latitude": 52.550471,
          "longitude": 13.351966
        },
        "products": {
          "suburban": false,
          "subway": true,
          "tram": true,
          "bus": true,
          "ferry": false,
          "express": false,
          "regional": false
        },
        "stationDHID": "de:11000:900009103"
      },
      "destination": {
        "type": "stop",
        "id": "900100001",
        "name": "S+U Friedrichstr. Bhf (Berlin)",
        "location": {
          "type": "location",
          "id": "900100001",
          "latitude": 52.520519,
          "longitude": 13.386448
        },
        "products": {
          "suburban": true,
          "subway": true,
          "tram": true,
          "bus": true,
          "ferry": false,
          "express": false,
          "regional": true
        },
        "stationDHID": "de:11000:900100001"
      },
      "departure": "2024-02-26T17:56:00+01:00",
      "plannedDeparture": "2024-02-26T17:56:00+01:00",
      "departureDelay": 0,
      "arrival": "2024-02-26T18:05:00+01:00",
      "plannedArrival": "2024-02-26T18:05:00+01:00",
      "arrivalDelay": 0,
      "reachable": true,
      "tripId": "1|46118|13|86|26022024",
      "line": {
        "type": "line",
        "id": "u6",
        "fahrtNr": "16262",
        "name": "U6",
        "public": true,
        "adminCode": "BVU---",
        "productName": "U",
        "mode": "train",
        "product": "subway",
        "operator": {
          "type": "operator",
          "id": "berliner-verkehrsbetriebe",
          "name": "Berliner Verkehrsbetriebe"
        },
        "color": {
          "fg": "#fff",
          "bg": "#6d61f2"
        }
      },
      "direction": "Alt-Mariendorf",
      "arrivalPlatform": "1",
      "plannedArrivalPlatform": "1",
      "arrivalPrognosisType": "prognosed",
      "departurePlatform": "1",
      "plannedDeparturePlatform": "1",
      "departurePrognosisType": "prognosed",
      "remarks": [
        {
          "type": "hint",
          "code": "OPERATOR",
          "text": "BVG"
        },
        {
          "type": "hint",
          "code": "FK",
          "text": "Bicycle conveyance (U Seestr. (Berlin))"
        },
        {
          "type": "hint",
          "code": "FK",
          "text": "Bicycle conveyance (S+U Friedrichstr. Bhf (Berlin))"
        },
        {
          "id": "216020",
          "type": "warning",
          "summary": "Public transport strikes",
          "text": "Berlin: From Thursday, 3 a.m. to Friday, 3 p.m., underground trains, trams and most bus lines will not be running / Brandenburg: Wednesday strike in the Uckermark, Thursday in Ostprignitz-Ruppin, Friday in 8 districts and the independent cities. S-Bahn, regional and long-distance trains will be running. Information: <a href=\"http://www.vbb.de/streik\" target=\"_blank\">www.vbb.de/streik</a> and <a href=\"http://www.bvg.de\n\" target=\"_blank\">www.bvg.de\n</a>",
          "icon": {
            "type": "HIM2",
            "title": null
          },
          "priority": 100,
          "products": {
            "suburban": true,
            "subway": true,
            "tram": true,
            "bus": true,
            "ferry": true,
            "express": true,
            "regional": true
          },
          "company": "VBB",
          "categories": [
            2
          ],
          "validFrom": "2024-02-23T13:07:00+01:00",
          "validUntil": "2024-03-01T23:59:00+01:00"
        }
      ],
      "cycle": {
        "min": 240,
        "max": 300,
        "nr": 26
      }
    },
    {
      "origin": {
        "type": "stop",
        "id": "900100001",
        "name": "S+U Friedrichstr. Bhf (Berlin)",
        "location": {
          "type": "location",
          "id": "900100001",
          "latitude": 52.520519,
          "longitude": 13.386448
        },
        "products": {
          "suburban": true,
          "subway": true,
          "tram": true,
          "bus": true,
          "ferry": false,
          "express": false,
          "regional": true
        },
        "stationDHID": "de:11000:900100001"
      },
      "destination": {
        "type": "stop",
        "id": "900100001",
        "name": "S+U Friedrichstr. Bhf (Berlin)",
        "location": {
          "type": "location",
          "id": "900100001",
          "latitude": 52.520519,
          "longitude": 13.386448
        },
        "products": {
          "suburban": true,
          "subway": true,
          "tram": true,
          "bus": true,
          "ferry": false,
          "express": false,
          "regional": true
        },
        "stationDHID": "de:11000:900100001"
      },
      "departure": "2024-02-26T18:05:00+01:00",
      "plannedDeparture": "2024-02-26T18:05:00+01:00",
      "departureDelay": 0,
      "arrival": "2024-02-26T18:05:00+01:00",
      "plannedArrival": "2024-02-26T18:05:00+01:00",
      "arrivalDelay": 0,
      "public": true,
      "walking": true,
      "distance": null
    },
    {
      "origin": {
        "type": "stop",
        "id": "900100001",
        "name": "S+U Friedrichstr. Bhf (Berlin)",
        "location": {
          "type": "location",
          "id": "900100001",
          "latitude": 52.520519,
          "longitude": 13.386448
        },
        "products": {
          "suburban": true,
          "subway": true,
          "tram": true,
          "bus": true,
          "ferry": false,
          "express": false,
          "regional": true
        },
        "stationDHID": "de:11000:900100001"
      },
      "destination": {
        "type": "stop",
        "id": "900120005",
        "name": "S Ostbahnhof (Berlin)",
        "location": {
          "type": "location",
          "id": "900120005",
          "latitude": 52.510335,
          "longitude": 13.435089
        },
        "products": {
          "suburban": true,
          "subway": false,
          "tram": false,
          "bus": true,
          "ferry": false,
          "express": true,
          "regional": true
        },
        "stationDHID": "de:11000:900120005"
      },
      "departure": "2024-02-26T18:12:00+01:00",
      "plannedDeparture": "2024-02-26T18:11:00+01:00",
      "departureDelay": 60,
      "arrival": "2024-02-26T18:19:00+01:00",
      "plannedArrival": "2024-02-26T18:19:00+01:00",
      "arrivalDelay": 0,
      "reachable": true,
      "tripId": "1|2339|25|86|26022024",
      "line": {
        "type": "line",
        "id": "s7",
        "fahrtNr": "26717",
        "name": "S7",
        "public": true,
        "adminCode": "DBS---",
        "productName": "S",
        "mode": "train",
        "product": "suburban",
        "operator": {
          "type": "operator",
          "id": "s-bahn-berlin-gmbh",
          "name": "S-Bahn Berlin GmbH"
        },
        "color": {
          "fg": "#fff",
          "bg": "#6d61f2"
        }
      },
      "direction": "S Ahrensfelde Bhf (Berlin)",
      "currentLocation": {
        "type": "location",
        "latitude": 52.404037,
        "longitude": 13.147587
      },
      "arrivalPlatform": "8",
      "plannedArrivalPlatform": "8",
      "arrivalPrognosisType": "prognosed",
      "departurePlatform": "5",
      "plannedDeparturePlatform": "5",
      "departurePrognosisType": "prognosed",
      "remarks": [
        {
          "type": "hint",
          "code": "OPERATOR",
          "text": "DBS"
        },
        {
          "type": "hint",
          "code": "FK",
          "text": "Bicycle conveyance (S+U Friedrichstr. Bhf (Berlin))"
        },
        {
          "type": "hint",
          "code": "FK",
          "text": "Bicycle conveyance (S Ostbahnhof (Berlin))"
        },
        {
          "id": "216020",
          "type": "warning",
          "summary": "Public transport strikes",
          "text": "Berlin: From Thursday, 3 a.m. to Friday, 3 p.m., underground trains, trams and most bus lines will not be running / Brandenburg: Wednesday strike in the Uckermark, Thursday in Ostprignitz-Ruppin, Friday in 8 districts and the independent cities. S-Bahn, regional and long-distance trains will be running. Information: <a href=\"http://www.vbb.de/streik\" target=\"_blank\">www.vbb.de/streik</a> and <a href=\"http://www.bvg.de\n\" target=\"_blank\">www.bvg.de\n</a>",
          "icon": {
            "type": "HIM2",
            "title": null
          },
          "priority": 100,
          "products": {
            "suburban": true,
            "subway": true,
            "tram": true,
            "bus": true,
            "ferry": true,
            "express": true,
            "regional": true
          },
          "company": "VBB",
          "categories": [
            2
          ],
          "validFrom": "2024-02-23T13:07:00+01:00",
          "validUntil": "2024-03-01T23:59:00+01:00"
        }
      ],
      "cycle": {
        "min": 120,
        "max": 300,
        "nr": 43
      }
    },
    {
      "origin": {
        "type": "stop",
        "id": "900120005",
        "name": "S Ostbahnhof (Berlin)",
        "location": {
          "type": "location",
          "id": "900120005",
          "latitude": 52.510335,
          "longitude": 13.435089
        },
        "products": {
          "suburban": true,
          "subway": false,
          "tram": false,
          "bus": true,
          "ferry": false,
          "express": true,
          "regional": true
        },
        "stationDHID": "de:11000:900120005"
      },
      "destination": {
        "type": "location",
        "id": "9706296",
        "latitude": 52.51207,
        "longitude": 13.430864,
        "address": "10243 Berlin-Friedrichshain, Andreasstraße 72"
      },
      "departure": "2024-02-26T18:19:00+01:00",
      "plannedDeparture": "2024-02-26T18:19:00+01:00",
      "departureDelay": null,
      "arrival": "2024-02-26T18:26:00+01:00",
      "plannedArrival": "2024-02-26T18:26:00+01:00",
      "arrivalDelay": null,
      "public": true,
      "walking": true,
      "distance": 503
    }
  ],
  "refreshToken": "¶HKI¶G@F$A=2@O=13351 Berlin-Wedding, Guineastraße 27@H=27@X=13342707@Y=52549788@L=9721490@a=128@$A=1@O=U Seestr. (Berlin)@L=900009103@a=128@$202402261744$202402261756$$$1$$$$$$§T$A=1@O=U Seestr. (Berlin)@L=900009103@a=128@$A=1@O=S+U Friedrichstr. Bhf (Berlin)@L=900100001@a=128@$202402261756$202402261805$      U6$$1$$$$$$§T$A=1@O=S+U Friedrichstr. Bhf (Berlin)@L=900100001@a=128@$A=1@O=S Ostbahnhof (Berlin)@L=900120005@a=128@$202402261811$202402261819$      S7$$1$$$$$$§G@F$A=1@O=S Ostbahnhof (Berlin)@L=900120005@a=128@$A=2@O=10243 Berlin-Friedrichshain, Andreasstraße 72@H=72@X=13430864@Y=52512070@L=9706296@a=128@$202402261819$202402261826$$$1$$$$$$¶GP¶ft@0@2000@120@0@100@1@@0@@@@@false@0@-1@0@-1@-1@$f@$f@$f@$f@$f@$§bt@0@2000@120@0@100@1@@0@@@@@false@0@-1@0@-1@-1@$f@$f@$f@$f@$f@$§tt@0@250000@120@0@100@1@@0@@@@@false@0@-1@0@-1@-1@$t@0@250000@120@0@100@1@@0@@@@@false@0@-1@0@-1@-1@$t@0@0@0@0@100@-1@0@0@@@@@false@0@-1@0@-1@-1@$f@$f@$f@$§¶KC¶#VE#2#CF#100#CA#0#CM#0#SICT#0#AM#16433#AM2#0#RT#15#¶KCC¶I1ZFIzEjRVJHIzQjSElOIzAjRUNLIzE1NDY0fDE1NDY0fDE1NTA2fDE1NTA2fDB8MHwxNjV8MTU0NjF8MXwwfDEwfDB8MHwtMjE0NzQ4MzY0OCNHQU0jMjYwMjI0MTc0NCMKWiNWTiMxI1NUIzE3MDg2MDc2NjkjUEkjMCNaSSM0NjExOCNUQSMxMyNEQSMyNjAyMjQjMVMjOTAwMDg2MTAyIzFUIzE3NTEjTFMjOTAwMDcwMzAxI0xUIzE4MjIjUFUjODYjUlQjMSNDQSNVI1pFI1U2I1pCIyAgICAgIFU2I1BDIzEjRlIjOTAwMDA5MTAzI0ZUIzE3NTYjVE8jOTAwMTAwMDAxI1RUIzE4MDUjClojVk4jMSNTVCMxNzA4NjA3NjY5I1BJIzAjWkkjMjMzOSNUQSMyNSNEQSMyNjAyMjQjMVMjOTAwMjMwOTk5IzFUIzE3MzEjTFMjOTAwMTcwMDA0I0xUIzE4NDQjUFUjODYjUlQjMSNDQSNTLTcjWkUjUzcjWkIjICAgICAgUzcjUEMjMCNGUiM5MDAxMDAwMDEjRlQjMTgxMSNUTyM5MDAxMjAwMDUjVFQjMTgxOSM=¶KRCC¶#VE#1#",
  "cycle": {
    "min": 240
  }
}
   */

    return { data: results.data }
  } catch (e: AxiosError | any) {
    // TODO: make log, monitor
    console.log('hello route error', e)

    return { error: { status: e.response.status } }
  }
}

