# Security Specification for Neon Finance Tracker

## Data Invariants
1. An expense cannot exist without a valid userId.
2. An expense must have a positive amount.
3. An expense date must be in the past or present.
4. An expense category must be one of the predefined types.

## The "Dirty Dozen" Payloads (Examples to deny)
1. {userId: "other-uid", amount: 10, category: "Food", date: "2026-01-01", description: "Lunch"} - Should be denied if not owner.
2. {userId: "my-uid", amount: -10, category: "Food", date: "2026-01-01", description: "Invalid"} - Should be denied (negative amount).
3. {userId: "my-uid", amount: 10, category: "InvalidCat", date: "2026-01-01", description: "Invalid"} - Should be denied (invalid category).
4. ... (other payloads follow similar pattern)
