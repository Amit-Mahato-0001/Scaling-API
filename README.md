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

# TEST 5 – After Enabling Node.js Clustering (Multi-Core Scaling)

## Overview

I enabled Node.js clustering to utilize all available CPU cores.

Goals:

- Improve concurrency handling
- Utilize multi-core CPU architecture
- Increase throughput under high load
- Compare performance against single-process execution

Cluster module was used to fork worker processes equal to the number of CPU cores.

---

## Load Testing Configuration

**Tool used:** Autocannon  

**Command:**

```
autocannon http://localhost:3000/user
```

### Test Parameters

- Concurrency (Connections): 10  
- Duration: 10–11 secs  
- Endpoint tested: `/user`

---

## Metrics

```
┌─────────┬──────┬──────┬───────┬──────┬─────────┬─────────┬───────┐
│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%  │ Avg     │ Stdev   │ Max   │
├─────────┼──────┼──────┼───────┼──────┼─────────┼─────────┼───────┤
│ Latency │ 0 ms │ 0 ms │ 1 ms  │ 2 ms │ 0.44 ms │ 0.58 ms │ 13 ms │
└─────────┴──────┴──────┴───────┴──────┴─────────┴─────────┴───────┘
┌───────────┬─────────┬─────────┬─────────┬─────────┬──────────┬────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg      │ Stdev  │ Min     │
├───────────┼─────────┼─────────┼─────────┼─────────┼──────────┼────────┼─────────┤
│ Req/Sec   │ 8,623   │ 8,623   │ 10,039  │ 10,327  │ 9,761.82 │ 515.29 │ 8,620   │
├───────────┼─────────┼─────────┼─────────┼─────────┼──────────┼────────┼─────────┤
│ Bytes/Sec │ 3.21 MB │ 3.21 MB │ 3.73 MB │ 3.84 MB │ 3.63 MB  │ 191 kB │ 3.21 MB │
└───────────┴─────────┴─────────┴─────────┴─────────┴──────────┴────────┴─────────┘

0 2xx responses, 107369 non 2xx responses  
107k requests in 11.02s, 39.9 MB read
```

---

## Observed Performance Metrics

- Avg latency: 0.44ms  
- Requests per sec: ~9,762 req/sec  
- Total requests: ~107k  
- Majority responses were non-2xx due to rate limiting  

---

## Key Learning

Enabling clustering significantly increased throughput compared to single-process execution,
By utilizing multiple CPU cores the application handled nearly double the requests per second while maintaining extremely low latency.

This test demonstrates vertical scaling within a single machine,
Node.js clustering allows better CPU utilization and improves concurrency handling without modifying application logic,
When combined with Redis-based caching and rate limiting the system remains stable and scalable under high traffic.

---

# TEST 6 – Concurrency Saturation & Optimal Throughput Analysis

## Overview

After enabling clustering, Redis caching, and rate limiting, additional load tests were conducted to determine the **optimal concurrency level** for the system.

The objective of this phase was to identify:

- The concurrency level that produces **maximum throughput**
- The point where **latency begins increasing significantly**
- The **saturation threshold** where increasing concurrency no longer improves performance

To achieve this, the system was tested with progressively increasing concurrency levels.

---

## Load Testing Configuration

**Tool used:** Autocannon  

**Command:**

```
autocannon -c <connections> -d 20 http://localhost:3000/user
```

### Test Parameters

- Duration: 20 secs  
- Endpoint tested: `/user`  
- Concurrency levels tested: **50, 100, 200, 300**

---

# TEST 6.1 – Concurrency 50

## Metrics

```
┌─────────┬──────┬──────┬───────┬───────┬─────────┬─────────┬─────────┐
│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%   │ Avg     │ Stdev   │ Max     │
├─────────┼──────┼──────┼───────┼───────┼─────────┼─────────┼─────────┤
│ Latency │ 1 ms │ 3 ms │ 13 ms │ 17 ms │ 4.41 ms │ 6.49 ms │ 1101 ms │
└─────────┴──────┴──────┴───────┴───────┴─────────┴─────────┴─────────┘
┌───────────┬─────────┬─────────┬────────┬─────────┬───────────┬─────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%    │ 97.5%   │ Avg       │ Stdev   │ Min     │
├───────────┼─────────┼─────────┼────────┼─────────┼───────────┼─────────┼─────────┤
│ Req/Sec   │ 6,591   │ 6,591   │ 10,743 │ 11,863  │ 10,187.7  │ 1,375.1 │ 6,589   │
│ Bytes/Sec │ 2.45 MB │ 2.45 MB │ 4 MB   │ 4.42 MB │ 3.79 MB   │ 512 kB  │ 2.45 MB │
└───────────┴─────────┴─────────┴────────┴─────────┴───────────┴─────────┴─────────┘

204k requests in 20.05s, 75.8 MB read
```

---

## Observed Performance Metrics

- Avg latency: ~4.41 ms
- Requests per sec: ~10,187 req/sec
- Total requests: ~204k

---

# TEST 6.2 – Concurrency 100

## Metrics

```
┌─────────┬──────┬──────┬───────┬───────┬─────────┬─────────┬─────────┐
│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%   │ Avg     │ Stdev   │ Max     │
├─────────┼──────┼──────┼───────┼───────┼─────────┼─────────┼─────────┤
│ Latency │ 0 ms │ 2 ms │ 25 ms │ 30 ms │ 6.67 ms │ 9.66 ms │ 1132 ms │
└─────────┴──────┴──────┴───────┴───────┴─────────┴─────────┴─────────┘
┌───────────┬─────────┬─────────┬─────────┬─────────┬──────────┬──────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg      │ Stdev    │ Min     │
├───────────┼─────────┼─────────┼─────────┼─────────┼──────────┼──────────┼─────────┤
│ Req/Sec   │ 7,711   │ 7,711   │ 14,303  │ 15,559  │ 13,948.1 │ 1,974.36 │ 7,708   │
│ Bytes/Sec │ 2.87 MB │ 2.87 MB │ 5.32 MB │ 5.79 MB │ 5.19 MB  │ 735 kB   │ 2.87 MB │
└───────────┴─────────┴─────────┴─────────┴─────────┴──────────┴──────────┴─────────┘

279k requests in 20.04s, 104 MB read
```

---

## Observed Performance Metrics

- Avg latency: ~6.67 ms
- Requests per sec: ~13,948 req/sec
- Total requests: ~279k

This test achieved the **highest throughput among all concurrency levels tested**.

---

# TEST 6.3 – Concurrency 200

## Metrics

```
┌─────────┬──────┬───────┬───────┬───────┬──────────┬─────────┬─────────┐
│ Stat    │ 2.5% │ 50%   │ 97.5% │ 99%   │ Avg      │ Stdev   │ Max     │
├─────────┼──────┼───────┼───────┼───────┼──────────┼─────────┼─────────┤
│ Latency │ 0 ms │ 16 ms │ 28 ms │ 33 ms │ 15.91 ms │ 8.55 ms │ 1105 ms │
└─────────┴──────┴───────┴───────┴───────┴──────────┴─────────┴─────────┘
┌───────────┬─────────┬─────────┬─────────┬─────────┬──────────┬─────────┬─────────┐
│ Req/Sec   │ 9,967   │ 9,967   │ 12,287  │ 13,767  │ 12,180.4 │ 1,276.2 │ 9,967   │
│ Bytes/Sec │ 3.71 MB │ 3.71 MB │ 4.57 MB │ 5.12 MB │ 4.53 MB  │ 474 kB  │ 3.71 MB │
└───────────┴─────────┴─────────┴─────────┴─────────┴──────────┴─────────┴─────────┘

244k requests in 20.05s, 90.6 MB read
```

---

# TEST 6.4 – Concurrency 300

## Metrics

```
┌─────────┬───────┬───────┬───────┬───────┬──────────┬─────────┬─────────┐
│ Stat    │ 2.5%  │ 50%   │ 97.5% │ 99%   │ Avg      │ Stdev   │ Max     │
├─────────┼───────┼───────┼───────┼───────┼──────────┼─────────┼─────────┤
│ Latency │ 17 ms │ 23 ms │ 33 ms │ 40 ms │ 23.12 ms │ 7.14 ms │ 1130 ms │
└─────────┴───────┴───────┴───────┴───────┴──────────┴─────────┴─────────┘
┌───────────┬─────────┬─────────┬─────────┬─────────┬──────────┬────────┬─────────┐
│ Req/Sec   │ 9,567   │ 9,567   │ 12,927  │ 13,383  │ 12,711.6 │ 817.55 │ 9,561   │
│ Bytes/Sec │ 3.56 MB │ 3.56 MB │ 4.81 MB │ 4.98 MB │ 4.73 MB  │ 305 kB │ 3.56 MB │
└───────────┴─────────┴─────────┴─────────┴─────────┴──────────┴────────┴─────────┘

255k requests in 20.07s, 94.6 MB read
```

---

# Observed Scaling Pattern

| Concurrency | Avg Latency | Req/Sec |
|-------------|-------------|--------|
| 50 | ~4.41 ms | ~10,187 |
| **100** | **~6.67 ms** | **~13,948** |
| 200 | ~15.91 ms | ~12,180 |
| 300 | ~23.12 ms | ~12,711 |

---

# Key Learning

The system demonstrates a **throughput saturation curve**.

Initially, increasing concurrency improves throughput as the server utilizes CPU resources more efficiently.

However, after reaching system capacity:

- additional requests wait in queues
- latency increases significantly
- throughput no longer improves

At **100 concurrent requests**, the system achieved:

- **maximum throughput (~14k req/sec)**
- **low latency (~6.67 ms)**
- **stable performance**

Beyond this point, increasing concurrency only increases latency without improving throughput.

---

# Final Conclusion

```
Peak throughput ≈ 14k requests/sec
Optimal concurrency ≈ 100
Saturation begins ≈ 150–200
```

Operating the system around **100 concurrent requests** provides the best balance between **maximum throughput and minimal latency**, ensuring stable and efficient performance under load.

---

# TEST 7 – Horizontal Scaling Using NGINX

## Overview

After testing vertical scaling with Node.js clustering, the next step was to try **horizontal scaling**.

Instead of running only one server, I started **multiple Node.js servers** and placed **NGINX in front of them** to distribute the traffic.

This setup is very common in real production systems.

The idea is simple:

- client sends request
- NGINX receives it
- NGINX forwards the request to one of the backend servers

---

## Architecture

```
Client
   │
   ▼
NGINX Load Balancer
   │
   ├── Node Server :3000
   └── Node Server :3001
```

Both servers run the same application, and NGINX spreads the traffic between them.

---

## Load Testing Configuration

**Tool used:** Autocannon

Command used:

```
autocannon -c 100 -d 20 http://localhost:8080/user
```

### Test Parameters

- Concurrency: 100
- Duration: 20 seconds
- Endpoint: `/user`

---

## Metrics

```
┌─────────┬───────┬───────┬───────┬───────┬──────────┬──────────┬─────────┐
│ Stat    │ 2.5%  │ 50%   │ 97.5% │ 99%   │ Avg      │ Stdev    │ Max     │
├─────────┼───────┼───────┼───────┼───────┼──────────┼──────────┼─────────┤
│ Latency │ 23 ms │ 36 ms │ 77 ms │ 94 ms │ 41.07 ms │ 50.05 ms │ 1114 ms │
└─────────┴───────┴───────┴───────┴───────┴──────────┴──────────┴─────────┘
┌───────────┬─────┬──────┬────────┬────────┬──────────┬────────┬────────┐
│ Req/Sec   │ 0   │ 0    │ 2,553  │ 2,939  │ 2,406.31 │ 609.77 │ 1,894  │
└───────────┴─────┴──────┴────────┴────────┴──────────┴────────┴────────┘

48k requests in 20.07s
```

---

## Observations

The results were interesting.

Even though we added more servers, the throughput did **not increase much**.  
Latency also became higher compared to the earlier tests.

This suggested that something else in the system was slowing things down.

---

## Key Learning

In distributed systems, adding more servers does not always increase performance.

If all servers depend on the same external service, that service can become the **bottleneck**.

In this case, both servers were using the same **Redis instance**, which likely limited the system performance.

---

# TEST 8 – Testing Without Redis

## Overview

To confirm whether Redis was the bottleneck, I removed Redis from the request flow and tested the system again.

Instead of reading from cache, the API simply returned the response directly.

This helped isolate the application performance.

---

## Load Testing Configuration

Command used:

```
autocannon -c 100 -d 20 http://localhost:8080/user
```

---

## Metrics

```
┌─────────┬───────┬───────┬───────┬───────┬──────────┬─────────┬────────┐
│ Stat    │ 2.5%  │ 50%   │ 97.5% │ 99%   │ Avg      │ Stdev   │ Max    │
├─────────┼───────┼───────┼───────┼───────┼──────────┼─────────┼────────┤
│ Latency │ 16 ms │ 19 ms │ 32 ms │ 38 ms │ 20.64 ms │ 5.09 ms │ 114 ms │
└─────────┴───────┴───────┴───────┴───────┴──────────┴─────────┴────────┘
┌───────────┬────────┬────────┬─────────┬─────────┬──────────┬────────┬────────┐
│ Req/Sec   │ 3,643  │ 3,643  │ 4,867   │ 5,255   │ 4,732.36 │ 487.35 │ 3,643  │
└───────────┴────────┴────────┴─────────┴─────────┴──────────┴────────┴────────┘

95k requests in 20.05s
```

---

## Observations

After removing Redis, the throughput increased from around **2.4k req/sec to about 4.7k req/sec**.

Latency also improved.

This confirmed that Redis was adding extra overhead to every request.

---

## Key Learning

Caching systems like Redis are useful, but they also introduce network calls.

If many servers depend on a single Redis instance, it can become a **performance bottleneck**.

---

# TEST 9 – Stress Test (500 Concurrent Users)

## Overview

Finally, I wanted to see how the system behaves under **very heavy load**.

So I increased concurrency to **500 users**.

The goal of this test was to see:

- how the system behaves when pushed beyond normal limits
- when latency starts increasing heavily
- when errors start appearing

---

## Load Testing Configuration

Command used:

```
autocannon -c 500 -d 20 http://localhost:8080/user
```

---

## Metrics

```
┌─────────┬────────┬────────┬─────────┬─────────┬───────────┬───────────┬─────────┐
│ Stat    │ 2.5%   │ 50%    │ 97.5%   │ 99%     │ Avg       │ Stdev     │ Max     │
├─────────┼────────┼────────┼─────────┼─────────┼───────────┼───────────┼─────────┤
│ Latency │ 119 ms │ 140 ms │ 1350 ms │ 2141 ms │ 255.09 ms │ 337.19 ms │ 3353 ms │
└─────────┴────────┴────────┴─────────┴─────────┴───────────┴───────────┴─────────┘
┌───────────┬────────┬────────┬────────┬─────────┬──────────┬────────┬────────┐
│ Req/Sec   │ 1,664  │ 1,664  │ 3,543  │ 4,027   │ 3,449.25 │ 567.53 │ 1,664  │
└───────────┴────────┴────────┴────────┴─────────┴──────────┴────────┴────────┘

70k requests in 20 seconds
479 errors
```

---

## Observations

At this level of load, the system clearly reached its limits.

Latency increased a lot and some requests started failing.

Even though concurrency increased, the number of requests processed per second did not increase much.

---

## Key Learning

This shows a common behavior in real systems.

When a system reaches its limit:

- requests start waiting
- latency increases
- errors begin to appear

That is why production systems usually run **below their maximum capacity** to stay stable.

