# API Endpoints Documentation

This document provides a comprehensive list of all API endpoints available in the service platform backend.

## Table of Contents
- [User Endpoints](#user-endpoints)
- [Profile Endpoints](#profile-endpoints)
- [Job Endpoints](#job-endpoints)
- [Proposal Endpoints](#proposal-endpoints)
- [Contract Endpoints](#contract-endpoints)
- [Payment Endpoints](#payment-endpoints)
- [Review Endpoints](#review-endpoints)

## User Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/auth/register` | Register a new user | `{ email, password, role }` | User object |
| POST | `/auth/login` | Login a user | `{ email, password }` | JWT token |
| GET | `/user` | Get all users | - | Array of users |
| GET | `/user/:id` | Get a specific user | - | User object |
| PATCH | `/user/:id` | Update a user | User fields to update | Updated user |
| DELETE | `/user/:id` | Delete a user | - | - |

## Profile Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/profile` | Create a profile | `{ userId, bio?, mobileMoneyNumber?, bankAccountNumber?, nationalIdUrl?, location? }` | Profile object |
| GET | `/profile` | Get all profiles | - | Array of profiles |
| GET | `/profile/:id` | Get a specific profile | - | Profile object |
| GET | `/profile/user/:userId` | Get profile by user ID | - | Profile object |
| PATCH | `/profile/:id` | Update a profile | `{ bio?, mobileMoneyNumber?, bankAccountNumber?, nationalIdUrl?, location? }` | Updated profile |
| DELETE | `/profile/:id` | Delete a profile | - | - |

## Job Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/job` | Create a new job | `{ title, description, category, budget, numberOfSlots, clientId }` | Job object |
| GET | `/job` | Get all jobs | Optional query params: `category`, `status`, `clientId` | Array of jobs |
| GET | `/job/client/:clientId` | Get jobs by client | - | Array of jobs |
| GET | `/job/:id` | Get a specific job | - | Job object with client and proposals |
| PATCH | `/job/:id` | Update a job | Job fields to update | Updated job |
| DELETE | `/job/:id` | Delete a job | - | - |
| PATCH | `/job/:id/status` | Update job status | `{ status }` (open, in_progress, completed) | Updated job |
| PATCH | `/job/:id/accept-proposal` | Accept a proposal | - | Updated job with incremented slots |

## Proposal Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/proposal` | Create a new proposal | `{ freelancerId, jobId, coverLetter, bidAmount, status? }` | Proposal object |
| GET | `/proposal` | Get all proposals | Optional query params: `jobId`, `freelancerId`, `status` | Array of proposals |
| GET | `/proposal/job/:jobId` | Get proposals by job | - | Array of proposals |
| GET | `/proposal/freelancer/:freelancerId` | Get proposals by freelancer | - | Array of proposals |
| GET | `/proposal/:id` | Get a specific proposal | - | Proposal object |
| PATCH | `/proposal/:id` | Update a proposal | Proposal fields to update | Updated proposal |
| PATCH | `/proposal/:id/status` | Update proposal status | `{ status }` (pending, accepted, rejected) | Updated proposal |
| DELETE | `/proposal/:id` | Delete a proposal | - | - |

## Contract Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/contract` | Create a new contract | `{ proposalId, escrowAmount, userId?, status? }` | Contract object |
| GET | `/contract` | Get all contracts | Optional query params: `userId`, `status` | Array of contracts |
| GET | `/contract/:id` | Get a specific contract | - | Contract object with related data |
| GET | `/contract/user/:userId` | Get contracts by user | - | Array of contracts |
| PATCH | `/contract/:id` | Update a contract | Contract fields to update | Updated contract |
| PATCH | `/contract/:id/status` | Update contract status | `{ status }` (active, completed, disputed) | Updated contract |
| DELETE | `/contract/:id` | Delete a contract | - | - |

## Payment Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/payment` | Create a new payment | `{ contractId, amount, paymentMethod, transactionId }` | Payment object |
| GET | `/payment` | Get all payments | Optional query params: `contractId`, `status` | Array of payments |
| GET | `/payment/:id` | Get a specific payment | - | Payment object with related data |
| GET | `/payment/contract/:contractId` | Get payments by contract | - | Array of payments |
| PATCH | `/payment/:id` | Update a payment | `{ amount?, paymentMethod?, transactionId? }` | Updated payment |
| PATCH | `/payment/:id/status` | Update payment status | `{ status }` (pending, completed, failed) | Updated payment |
| DELETE | `/payment/:id` | Delete a payment | - | - |

## Review Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/review` | Create a new review | `{ contractId, reviewerId, rating, comment? }` | Review object |
| GET | `/review` | Get all reviews | Optional query params: `contractId`, `reviewerId` | Array of reviews |
| GET | `/review/:id` | Get a specific review | - | Review object with related data |
| GET | `/review/contract/:contractId` | Get reviews by contract | - | Array of reviews |
| GET | `/review/reviewer/:reviewerId` | Get reviews by reviewer | - | Array of reviews |
| PATCH | `/review/:id` | Update a review | `{ comment? }` | Updated review |
| DELETE | `/review/:id` | Delete a review | - | - |