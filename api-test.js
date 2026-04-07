const baseUrl = 'http://localhost:8000/api/v1/user';

async function runTests() {
    console.log('--- Starting API Tests ---\n');
    let token = '';

    const logResult = (name, response, status, body, passed) => {
        console.log(`[${passed ? 'PASS' : 'FAIL'}] ${name}`);
        console.log(`Status: ${status}`);
        console.log(`Response:`);
        console.log(JSON.stringify(body, null, 2));
        console.log('-----------------------------------------------------\n');
    };


    // Step 1: Login
    console.log('Executing Step 1: Login...');
    try {
        const res = await fetch(`${baseUrl}/userLogin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test@gmail.com', password: '123456' })
        });
        const text = await res.text();
        let body;
        try {
            body = JSON.parse(text);
        } catch (e) {
            body = text;
        }
        const tokenData = body.data?.accessToken ? body.data : body.message;
        const passed = res.status === 200 && !!tokenData?.accessToken;
        logResult('Step 1: Login', res, res.status, body, passed);
        if (!passed) {
            console.log('Login failed, stopping tests. Check your server or test data.');
            return;
        }
        token = tokenData.accessToken;
    } catch (err) {
        console.log('[FAIL] Step 1: Login - Request Error:', err.message);
        return;
    }

    const authHeaders = {
        'Authorization': `Bearer ${token}`
    };

    const authHeadersWithJson = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    // Step 3.1: Current User
    console.log('Executing Step 3: /current-user ...');
    try {
        const res = await fetch(`${baseUrl}/current-user`, {
            headers: authHeaders
        });
        const body = await res.json();
        logResult('Step 3.1: Current User', res, res.status, body, res.status === 200);
    } catch (err) {
        console.log(`[FAIL] Step 3.1: Current User - Request Error: ${err.message}\n`);
    }

    // Step 3.2: Change Password
    console.log('Executing Step 3: /change-password ...');
    try {
        const res = await fetch(`${baseUrl}/change-password`, {
            method: 'POST',
            headers: authHeadersWithJson,
            body: JSON.stringify({ oldPassword: '123456', newPassword: 'new123456' })
        });
        const body = await res.json();
        logResult('Step 3.2: Change Password', res, res.status, body, res.status === 200);
    } catch (err) {
        console.log(`[FAIL] Step 3.2: Change Password - Request Error: ${err.message}\n`);
    }

    // Step 3.3: Update Account
    console.log('Executing Step 3: /update-account ...');
    try {
        const res = await fetch(`${baseUrl}/update-account`, {
            method: 'PATCH',
            headers: authHeadersWithJson,
            body: JSON.stringify({ fullname: 'Updated User', email: 'updated@gmail.com' })
        });
        const body = await res.json();
        logResult('Step 3.3: Update Account', res, res.status, body, res.status === 200);
    } catch (err) {
        console.log(`[FAIL] Step 3.3: Update Account - Request Error: ${err.message}\n`);
    }

    // Step 3.4: Channel Profile
    console.log('Executing Step 3: /channel/shubham ...');
    try {
        const res = await fetch(`${baseUrl}/channel/shubham`, {
            headers: authHeaders // In case it needs auth or not
        });
        const body = await res.json();
        logResult('Step 3.4: Channel Profile', res, res.status, body, res.status === 200);
    } catch (err) {
        console.log(`[FAIL] Step 3.4: Channel Profile - Request Error: ${err.message}\n`);
    }

    // Step 3.5: Watch History
    console.log('Executing Step 3: /watch-history ...');
    try {
        const res = await fetch(`${baseUrl}/watch-history`, {
            headers: authHeaders
        });
        const body = await res.json();
        logResult('Step 3.5: Watch History', res, res.status, body, res.status === 200);
    } catch (err) {
        console.log(`[FAIL] Step 3.5: Watch History - Request Error: ${err.message}\n`);
    }

    // Step 5: Negative test
    console.log('Executing Step 5: Negative test - /watch-history without token ...');
    try {
        const res = await fetch(`${baseUrl}/watch-history`);
        const text = await res.text();
        let body;
        try { body = JSON.parse(text); } catch (e) { body = text; }
        logResult('Step 5: Negative test (Watch history without token)', res, res.status, body, res.status === 401);
    } catch (err) {
        console.log(`[FAIL] Step 5: Negative test - Request Error: ${err.message}\n`);
    }
}

runTests();
