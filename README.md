# Backend Performance Lab

<p align="center">

  <img src="https://raw.githubusercontent.com/mcollina/autocannon/master/autocannon-banner.png" height="50" alt="autocannon"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" height="50"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" height="50"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg" height="50"/>
</p>

A hands-on backend performance engineering project designed to explore how systems behave under load, and how techniques like caching, rate limiting, clustering, and scaling impact real-world performance.

Experimental project — focused on learning system behavior under different conditions. Results may vary based on hardware and environment.

---

## What is this project?

This project is a practical exploration of backend performance.

Instead of just reading theory, it answers real questions like:

- How does latency affect throughput?
- What happens when you add Redis?
- Does scaling always improve performance?
- Where do real bottlenecks come from?

It’s built for developers who want to understand systems, not just use them.

---

## Key Concepts Explored

- Latency vs Throughput  
- Caching with Redis  
- Rate Limiting strategies  
- Vertical scaling (Node.js clustering)  
- Horizontal scaling (NGINX load balancing)  
- Concurrency saturation  
- Bottleneck identification  

---

## Key Features

### Real Load Testing

- Tested using Autocannon  
- Controlled concurrency & duration  
- Real metrics (latency, req/sec, errors)  

---

### Performance Comparison Scenarios

- Slow API vs Fast API  
- With and without caching  
- With and without rate limiting  
- Single process vs multi-core  

---

### Vertical Scaling (Clustering)

- Uses Node.js cluster module  
- Utilizes multiple CPU cores  
- Improves throughput significantly  

---

### Horizontal Scaling (NGINX)

- Multiple backend servers  
- Load distributed via NGINX  
- Simulates production architecture  

---

### Redis Integration

- Server-side caching  
- Rate limiting  
- Real-world tradeoffs analyzed  

---

### Concurrency Analysis

- Tested multiple concurrency levels  
- Identified optimal load conditions  
- Found saturation point  

---

## Performance Insights

### Latency vs Throughput

- 1000ms → ~9 req/sec  
- 1ms → ~5000 req/sec  

Small latency improvements → massive throughput gain.

---

### Caching Impact

- Removes repeated computation  
- Hides slow database calls  
- Keeps latency low under load  

---

### Rate Limiting Tradeoff

- Protects system from abuse  
- But introduces extra overhead  
- Write-heavy operations reduce performance  

---

### Clustering Impact

- ~2x throughput improvement  
- Better CPU utilization  
- No code changes required  

---

### Optimal Concurrency

- Best performance at ~100 users  
- ~14k req/sec achieved  
- Beyond that → latency increases  

---

### Bottleneck Discovery

Adding more servers didn’t improve performance.

Root cause:

Redis rate limiting (write-heavy operations) became the bottleneck.

---

## Key Learnings

- Faster response = more scalability  
- Caching is powerful but must be used wisely  
- Rate limiting can hurt performance if not optimized  
- Scaling only works if bottlenecks are removed  
- Always test assumptions — don’t guess  

---

## Tech Stack

- Node.js  
- Redis  
- NGINX  
- Autocannon  
- Cluster module  

---

## Project Results

Full test results and metrics available here:

→ [View TESTS.md](./TESTS.md)

---

## Final Thought

This project is about thinking like a backend engineer:

Not just building APIs, but understanding:

- how they break  
- how they scale  
- and where they fail  