# Performance Testing – Phase 1 & Phase 2

---

# TEST 1 – With Artificial 1-Second Delay

## Overview

I intentionally slowed down the API endpoint using a 1-sec delay to simulate a real-world DB call.  
The goal was to measure how response time affects the number of requests the server can handle per second.

---

## Load Testing Configuration

**Tool used:** Autocannon  

**Command:**

```
autocannon http://localhost:3000/user
```

### Test Parameters

- Concurrency (Connections): 10  
- Duration: 10 secs  
- Endpoint tested: `/user`

---

## Metrics

```
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

100 requests in 10.09s, 23.1 kB read
```

---

## Observed Performance Metrics

- Avg latency: ~1000ms  
- Requests per sec: ~9 req/sec  
- Total requests: 100  

---

## Key Learning

If response is slow, the server handles fewer requests.  
Before optimization, we must understand the real speed of the system.

---

---

# TEST 2 – Without Artificial Delay

## Overview

I removed the 1-sec delay from the API to measure the system's natural performance without I/O wait.

Performance testing was conducted again using Autocannon after removing `setTimeout`.

---

## Load Testing Configuration

**Tool used:** Autocannon  

**Command:**

```
autocannon http://localhost:3000/user
```

### Test Parameters

- Concurrency (Connections): 10  
- Duration: 10 secs  
- Endpoint tested: `/user`

---

## Metrics

```
┌─────────┬──────┬──────┬───────┬──────┬────────┬────────┬───────┐
│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%  │ Avg    │ Stdev  │ Max   │
├─────────┼──────┼──────┼───────┼──────┼────────┼────────┼───────┤
│ Latency │ 0 ms │ 1 ms │ 5 ms  │ 5 ms │ 1.5 ms │ 1.3 ms │ 17 ms │
└─────────┴──────┴──────┴───────┴──────┴────────┴────────┴───────┘
┌───────────┬────────┬────────┬─────────┬─────────┬─────────┬────────┬────────┐
│ Stat      │ 1%     │ 2.5%   │ 50%     │ 97.5%   │ Avg     │ Stdev  │ Min    │
├───────────┼────────┼────────┼─────────┼─────────┼─────────┼────────┼────────┤
│ Req/Sec   │ 3,653  │ 3,653  │ 5,023   │ 5,551   │ 4,972.7 │ 606.32 │ 3,653  │
├───────────┼────────┼────────┼─────────┼─────────┼─────────┼────────┼────────┤
│ Bytes/Sec │ 939 kB │ 939 kB │ 1.29 MB │ 1.43 MB │ 1.28 MB │ 156 kB │ 939 kB │
└───────────┴────────┴────────┴─────────┴─────────┴─────────┴────────┴────────┘

50k requests in 10.03s, 12.8 MB read
```

---

## Observed Performance Metrics

- Avg latency: 1.5ms  
- Requests per sec: ~4,972 req/sec  
- Total requests: ~50k  

---

## Key Learning

When response time decreases, the server can handle many more requests per second.  
Lower latency directly improves throughput and overall scalability.

---

# Final Insight

This comparison clearly highlights the importance of response time optimization in scalable backend systems.
