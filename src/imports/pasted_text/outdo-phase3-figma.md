Create Phase 3 for the “OutDo Handleless Shutters” Figma file.

Goal:
Build the real UI screens for Orders and Quotations, using the same accounts and data created in earlier phases.

Important rules:
- Use actual page layouts, not documentation boards
- Use the same accounts from Phase 2
- Keep projects, quotations, and values correlated
- Use Admin App for internal workflow
- Use Dealer / Architect / Factory pages for partner order and quotation visibility
- Add clickable flows from account to order to quotation

Build the following on “02 Admin App”:

1. Orders Dashboard
Create a real dashboard showing:
- total orders
- total quotations
- total quotation value
- open quotations
- under discussion quotations
- won quotations
- lost quotations
- held quotations
- quotation aging
- project category split
- source-wise order summary

2. Orders Table
Create the actual order list page.

Required columns:
- Order ID
- Project Name
- Site Name
- Project Category
- Account Type
- Account Name
- City
- State
- Zone/Territory
- Salesperson
- Order Source
- Business Source
- Quotation Status
- Payment Status
- Order Status
- Created Date
- Expected Closure Date
- Customer Required Date
- Internal Promised Date

3. New Order flow (internal)
Create the actual new-order screens:
- select account
- add project name/site
- category
- notes
- file upload
- create order

4. Order Detail page
Create actual order detail UI with:
- project summary
- account summary
- order source
- uploaded files
- linked quotation summary
- payment status
- notes/timeline
- create quotation action

5. File submission area
Create file intake UI for:
- CAD
- PDF
- hand sketch
- multiple file cards
- file tags
- upload state

6. Drawing-conversion status block
Create UI showing:
- original submitted
- CAD conversion pending
- CAD ready
- approval pending
- approved for production input

Now build quotation UI:

7. Quotation Builder
Create the real quotation builder page.

Include:
- project header
- account info
- quotation info
- line item table
- totals panel
- remarks
- save/send/download controls
- version info

8. Quotation line-item table
Create actual line-item editing UI with:
- Serial No
- Length
- Height
- Thickness
- Unit
- Area
- Quantity
- Item Name
- Item Category
- Rate
- Amount

Include:
- add row
- duplicate row
- delete row

9. Excel import state
Create the actual Excel import UI with:
- sample format download
- upload
- validation preview
- import summary
- imported rows preview

10. Quotation Detail page
Create the actual quotation detail screen with:
- header
- project/account context
- version info
- item table
- totals
- payment summary
- status
- send/download actions
- remarks/history

11. Quotation Version panel
Create:
- version history list
- active version
- create new version
- compare idea

12. Quotation outcome UI
Create real status handling for:
- Open
- Under Discussion
- Negotiation
- Won
- Lost
- Hold

Include lost/hold modal.

13. Pre-conversion payment block
Create reusable payment summary block with:
- Quotation Amount
- Received Amount
- Balance Amount
- Payment Status

Partner-side pages:
On Dealer / Architect / Factory pages create:
- new order page
- order list
- order detail
- quotation view
- payment summary visibility

Make the following flows clickable:
- account detail → new order
- orders table → order detail
- order detail → create quotation
- quotation builder → quotation detail
- quotation detail → version panel
- partner order list → order detail
- partner order detail → quotation view

Expected result:
A working UI and clickable flow for Account → Order → Quotation.