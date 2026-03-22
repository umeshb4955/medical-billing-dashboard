# Testing Checklist - MongoDB Integration

## ✅ Pre-Test Verification

Before testing, verify:
- [ ] Code has been pushed to GitHub (Done ✅)
- [ ] Vercel is building the latest version
- [ ] DATABASE_URL is set in Vercel environment variables
- [ ] MongoDB Atlas has Vercel IP whitelisted (0.0.0.0/0) or specific IPs

## 📋 Testing Steps

### Step 1: Check Deployment Status
1. Go to https://vercel.com/dashboard
2. Select your "medical-billing-dashboard" project
3. Click on "Deployments"
4. Verify the latest deployment status shows "✅ Ready"
5. Wait 1-2 minutes if still building

### Step 2: Test Login
1. Navigate to https://your-app.vercel.app
2. Try to login with:
   - Username: `admin`
   - Password: `password`
3. Should redirect to dashboard after successful login
4. Check browser console (F12) for any errors

### Step 3: Verify Initial Load
1. Dashboard should load with loading spinners
2. Statistics cards should show totals (even if 0)
3. Data grid should appear (empty or with existing bills)
4. No red error messages should appear

### Step 4: Create a New Bill
1. Click "Add Bill" button
2. Fill in the form:
   - Patient Name: `Test Patient`
   - Status: `Pending`
   - Add a medicine:
     - Medicine Name: `Paracetamol`
     - Quantity: `10`
     - Unit: `Tablets`
     - Price: `50`
3. Click "Save"
4. Watch for the spinner during save (should complete in 2-3 seconds)

### Step 5: Verify Bill Appears
1. After save completes, check the data grid
2. **Expected**: New bill with "Test Patient" and "$500.00" total
3. **If failing**: Bill doesn't appear in list after save

### Step 6: Test Edit
1. Click edit icon on the bill you just created
2. Change Patient Name to `Test Patient Updated`
3. Click Save
4. Verify the change appears in the dashboard

### Step 7: Test Delete
1. Click delete icon on the bill
2. Click "OK" in confirmation dialog
3. Verify bill disappears from dashboard immediately

### Step 8: Test PDF Download
1. Create another test bill
2. Click the download (⬇️) icon
3. Should generate PDF file (check Downloads folder)
4. Open PDF to verify it displays correctly

### Step 9: Test Print
1. Click the printer (🖨️) icon on any bill
2. Print preview should appear
3. Confirm it contains the correct bill data

## 🔍 Debugging If Tests Fail

### If Bills Don't Appear After Save
**Check 1**: Open browser DevTools (F12)
- Go to Network tab
- Create a new bill
- Find the `/api/bills` POST request
- Check Response tab - should show `{success: true, billId: "..."}`
- If empty or error, note the status code

**Check 2**: Check Vercel Logs
- Go to https://vercel.com/dashboard
- Click on project → Deployments → Latest → Logs
- Look for error messages
- Should see: "✅ Connected to MongoDB Atlas"

**Check 3**: Verify Environment Variables
- Go to Project Settings → Environment Variables
- Confirm `DATABASE_URL` is set and complete
- Format should be: `mongodb+srv://username:password@cluster.mongodb.net/db`

### If Login Fails
- Check DATABASE_URL is not undefined
- Verify MongoDB Atlas cluster is running
- Check IP whitelist in MongoDB Atlas

### If App Won't Load
- Clear browser cache (Ctrl+Shift+Delete)
- Try incognito/private mode
- Check browser console for errors
- Verify Vercel deployment completed successfully

## 📊 Expected Behavior

### After Fix is Deployed

| Action | Expected Result | Status |
|--------|-----------------|--------|
| Load dashboard | Shows statistics and empty grid | ✅ |
| Create bill | Bill appears immediately in grid | ✅ |
| Refresh page | Bill is still there (persisted) | ✅ |
| Edit bill | Changes appear after save | ✅ |
| Delete bill | Bill removed from grid | ✅ |
| PDF download | Generates invoice PDF | ✅ |
| Print invoice | Shows print preview | ✅ |
| API GET `/api/bills` | Returns array of bills | ✅ |
| API POST `/api/bills` | Returns `{success: true, billId}` | ✅ |

## 🚨 If Everything Fails

The most likely issue is DATABASE_URL environment variable:

1. **Verify MongoDB Connection String**
   - Go to MongoDB Atlas Dashboard
   - Click "Connect"
   - Copy connection string
   - Paste into Vercel environment variable

2. **Common Formats**
   ```
   mongodb+srv://username:password@cluster-name.mongodb.net/database_name
   mongodb://username:password@localhost:27017/database_name
   ```

3. **If still failing**
   - Check MongoDB Atlas IP whitelist
   - Add `0.0.0.0/0` or specific Vercel IPs
   - Restart MongoDB cluster connections

4. **Last Resort**
   - Redeploy from Vercel dashboard (click "Redeploy" button)
   - Clear all cache
   - Try different browser

## ℹ️ Support Information

- **API Endpoint**: `/api/bills` (GET all, POST create)
- **API Endpoint**: `/api/bills/[id]` (PUT update, DELETE remove)
- **Database**: MongoDB Atlas (production)
- **Local DB**: SQLite `billing.db` (development)
- **Documentation**: See `MONGODB_FIX_SUMMARY.md` for technical details

---

**Created**: After MongoDB integration fix deployment
**Status**: Ready for testing when Vercel redeploys (1-2 minutes)
**Last Updated**: Current deployment with all fixes applied
