## Overview

I intentionally slowed down the API endpoint using a 1-sec delay to simulate a real world DB call.
The goal was to measure how response time affects the number of requests the server can handle per sec.

## Load testing configuration

Tool used: Autocannon

Command:

autocannon http://localhost:3000/user

Test parameters:

- Concurrency (Connections): 10
- Duration: 10 secs
- Endpoint tested: /user

---

## Metrics

┌─────────┬─────────┬─────────┬─────────┬─────────┬────────────┬─────────┬─────────┐
│ Stat    │ 2.5%    │ 50%     │ 97.5%   │ 99%     │ Avg        │ Stdev   │ Max     │
├─────────┼─────────┼─────────┼─────────┼─────────┼────────────┼─────────┼─────────┤
│ Latency │ 1005 ms │ 1009 ms │ 1033 ms │ 1033 ms │ 1012.35 ms │ 7.73 ms │ 1033 ms │
└─────────┴─────────┴─────────┴─────────┴─────────┴────────────┴─────────┴─────────┘
┌───────────┬─────┬──────┬─────────┬─────────┬─────────┬───────┬─────────┐
│ Stat      │ 1%  │ 2.5% │ 50%     │ 97.5%   │ Avg     │ Stdev │ Min     │
├───────────┼─────┼──────┼─────────┼─────────┼─────────┼───────┼─────────┤
│ Req/Sec   │ 0   │ 0    │ 10      │ 10      │ 9       │ 3     │ 10      │
├───────────┼─────┼──────┼─────────┼─────────┼─────────┼───────┼─────────┤
│ Bytes/Sec │ 0 B │ 0 B  │ 2.57 kB │ 2.57 kB │ 2.31 kB │ 771 B │ 2.57 kB │
└───────────┴─────┴──────┴─────────┴─────────┴─────────┴───────┴─────────┘

Req/Bytes counts sampled once per second.
# of samples: 10

100 requests in 10.09s, 23.1 kB read

---

## Observed performance metrics

- Avg latency: ~1000ms
- Reqs per sec: ~9 req/sec
- Total reqs: 100

---

## Key learning : If response is slow then server will handle less requests, before optimization we need to understand the real speed of the system.
