Create Phase 5A for the “OutDo Handleless Shutters” Figma file.

Goal:
Build the internal Converted Orders / Operations UI screens.

Important rules:
- Use the same quotations/projects from earlier phases
- Only some quotations should become converted orders
- Keep project/account/value continuity
- Use Admin App page
- Build actual screens and clickable flows

Build:

1. Operations Dashboard
Show:
- total converted orders
- design pending
- production pending
- production in progress
- ready to dispatch
- dispatched
- delayed
- payment pending
- current bottlenecks
- priority split

2. Converted Orders Table
Required columns:
- Converted Order ID
- Project Name
- Account Name
- Account Type
- City
- Salesperson
- Project Manager
- Cutlist Designer
- Operations Head
- Production Manager
- Procurement Manager
- Packaging Manager
- Dispatch Manager
- Finance Manager
- Payment Status
- Production Status
- Dispatch Status
- Current Pending With
- Priority
- Quotation Amount
- Received Amount
- Balance Amount

3. Converted Order Detail
Create a rich detail page with:
- project header
- account info
- commercial summary
- assigned users
- payment summary
- production status
- dispatch status
- current pending with
- milestone timeline
- files
- notes/activity
- delay/hold section
- finance section

4. Role assignment modal
Create actual assign/reassign screens for key roles.

5. Milestone block
Create timeline with:
- conversion date
- PM assigned
- designer assigned
- cutlist ready
- production start
- packaging ready
- dispatch ready
- dispatch date
- completion date

6. Delay/Hold block
Create UI for delay or hold reason.

7. Finance update block
Create visible finance section with:
- Quotation Amount
- Received Amount
- Balance Amount
- payment entries view
- finance update action state

8. Production / dispatch progress blocks
Create status areas for execution tracking.

Make clickable:
- quotation detail → convert order
- converted order table → detail
- detail → assign role
- detail → finance update modal
- detail → status update

Expected result:
A working internal converted-order operations flow.