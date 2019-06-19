

/* ==========================================================================
   Promise Based Approach
   ========================================================================== */

// console.log('before');

// getUser(1)
//     .then(user => getRepositories(user.gitHubUsername))
//     .then(repos => getCommits(repos[0]))
//     .then(commits => console.log('commits', commits))
//     .catch(err => console.log('error', err.message));

// console.log('after');

/* ==========================================================================
   Async and Await Approach
   - need to use try/catch block to catch rejection error
   ========================================================================== */
console.log('before');

async function displayCommits() {

    try {
        const user = await getUser(1);
        // console.log('user', user);
        const repos = await getRepositories(user.gitHubUsername);
        // console.log('repos', repos);
        const commits = await getCommits(repos[0]);
        console.log('commits', commits);
    }
    catch (err) {
        console.log('Error: ', err.message);
    }

}

displayCommits();

console.log('after');


/* ==========================================================================
   Named Function Example
   - asyncronous
   ========================================================================== */

// console.log('before');

// getUser(1, getRepositories);

// console.log('after');


// function getRepositories(user) {
//     getRepositories(user.gitHubUsername, getCommits);
// }

// function getCommits(repos) {
//     getCommits(repo, displayCommits);
// }

// function displayCommits(commits) {
//     console.log('commits', commits);
// }



/* ==========================================================================
   Callback Example
   - callback HELL
   - asyncronous
   - before using named functions
   ========================================================================== */

// console.log('before');

// getUser(1, (user) => {

//     console.log('user', user);

//     getRepositories(user.gitHubUsername, (repos) => {
//         console.log('repositories', repos);

//         getCommits(repos, (commits) => {
//             console.log('commits', commits);
//         });

//     });

// });

// console.log('after');

/* ==========================================================================
   The Functions Used for Demo
   ========================================================================== */

function getUser(id, callback) {

    return new Promise((resolve, reject) => {
        // kick off async work
        setTimeout(() => {

            console.log('reading a user from database...');
            resolve({ id: id, gitHubUsername: 'leatherface416'});

        }, 2000);

    });


}

function getRepositories(username, callback) {

    return new Promise((resolve, reject) => {

        setTimeout(() => {

            console.log('retrieving list of repositories...');
            // resolve(['repo1', 'repo2', 'repo3']);
            reject(new Error('Could not get repos'));

        }, 2000);

    });


}

function getCommits(commits, callback){

    return new Promise((resolve, reject) => {

        setTimeout(() => {

            console.log('get repo commits...');
            resolve(['commit1', 'commit2', 'commit3']);

        });

    });

}


