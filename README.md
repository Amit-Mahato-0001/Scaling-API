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

---

# TEST 3 – After Rate Limiting & Redis Caching (Fast API Scenario)

## Overview

I implemented Redis-based rate limiting and server-side caching on the fast (no artificial delay) version of the API.

Goals:

- Introduce rate limiting using Redis
- Add server-side caching
- Measure system performance after adding production-like protection controls
- Validate that protection layers do not significantly degrade performance

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
┌─────────┬──────┬──────┬───────┬──────┬─────────┬─────────┬───────┐
│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%  │ Avg     │ Stdev   │ Max   │
├─────────┼──────┼──────┼───────┼──────┼─────────┼─────────┼───────┤
│ Latency │ 1 ms │ 1 ms │ 3 ms  │ 3 ms │ 1.19 ms │ 0.64 ms │ 28 ms │
└─────────┴──────┴──────┴───────┴──────┴─────────┴─────────┴───────┘
┌───────────┬────────┬────────┬─────────┬─────────┬─────────┬────────┬────────┐
│ Stat      │ 1%     │ 2.5%   │ 50%     │ 97.5%   │ Avg     │ Stdev  │ Min    │
├───────────┼────────┼────────┼─────────┼─────────┼─────────┼────────┼────────┤
│ Req/Sec   │ 3,775  │ 3,775  │ 5,771   │ 5,943   │ 5,583.7 │ 616.62 │ 3,774  │
├───────────┼────────┼────────┼─────────┼─────────┼─────────┼────────┼────────┤
│ Bytes/Sec │ 1.4 MB │ 1.4 MB │ 2.15 MB │ 2.21 MB │ 2.08 MB │ 229 kB │ 1.4 MB │
└───────────┴────────┴────────┴─────────┴─────────┴─────────┴────────┴────────┘

5 2xx responses, 55821 non 2xx responses  
56k requests in 10.03s, 20.8 MB read
```

---

## Observed Performance Metrics

- Avg latency: 1.19ms  
- Requests per sec: ~5,583 req/sec  
- Total requests: ~56k  
- Majority responses were non-2xx due to rate limiting  

---

## Key Learning

Even after introducing Redis-based rate limiting and caching latency remained extremely low.
This confirms that distributed protection layers do not significantly degrade performance in a fast API scenario.
Rate limiting blocked excessive traffic preventing abuse under high load.

---

# TEST 4 – Artificial Delay + Redis Caching + Rate Limiting

## Overview

I reintroduced the artificial 1-second delay while keeping Redis caching and rate limiting enabled.

Goals:

- Observe how caching behaves when the database is slow
- Measure performance impact of delay with Redis in place
- Validate that caching masks database latency

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
┌─────────┬──────┬──────┬───────┬──────┬─────────┬─────────┬─────────┐
│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%  │ Avg     │ Stdev   │ Max     │
├─────────┼──────┼──────┼───────┼──────┼─────────┼─────────┼─────────┤
│ Latency │ 1 ms │ 1 ms │ 3 ms  │ 3 ms │ 1.27 ms │ 9.97 ms │ 1027 ms │
└─────────┴──────┴──────┴───────┴──────┴─────────┴─────────┴─────────┘
┌───────────┬─────────┬─────────┬─────────┬─────────┬─────────┬────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg     │ Stdev  │ Min     │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼────────┼─────────┤
│ Req/Sec   │ 3,343   │ 3,343   │ 5,555   │ 5,859   │ 5,307.3 │ 705    │ 3,342   │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼────────┼─────────┤
│ Bytes/Sec │ 1.24 MB │ 1.24 MB │ 2.07 MB │ 2.18 MB │ 1.97 MB │ 262 kB │ 1.24 MB │
└───────────┴─────────┴─────────┴─────────┴─────────┴─────────┴────────┴─────────┘

5 2xx responses, 53063 non 2xx responses  
53k requests in 10.02s, 19.7 MB read
```

---

## Observed Performance Metrics

- Avg latency: 1.27ms  
- Max latency: ~1027ms (first uncached request)  
- Requests per sec: ~5,307 req/sec  
- Total requests: ~53k  
- Majority responses were non-2xx due to rate limiting  

---

## Key Learning

Even with a 1-second artificial delay Redis caching ensured that only the first request experience the delay.
Subsequent requests were served instantly from cache maintaining high throughput and low average latency.

---



