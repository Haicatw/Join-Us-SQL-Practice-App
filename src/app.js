var faker = require('faker');
var sqlite3 = require('sqlite3').verbose();

function generateFakeData(){
    let person = [];
    for(let i = 0; i < 500; i++) {
        person.push([faker.internet.email(), faker.date.past()]);
    }
    return person;
}

//var join_us_db = new sqlite3.Database('./db/join_us_db.db', sqlite3.OPEN_READWRITE, (err) => {
//    if (err) {
//        return console.error(err.message);
//    }
//    console.log('Database connection established. (ﾉ>ω<)ﾉ');
//});

var join_us_db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Database connection established. (ﾉ>ω<)ﾉ');
});
join_us_db.serialize(function() {
    let q = `
        CREATE TABLE users(
            email VARCHAR(255) PRIMARY KEY NOT NULL,
            created_at DATETIME DEFAULT(datetime('now'))
        );`;

    join_us_db.run(q, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Database created. (・ω・)');
    });

    // q = `INSERT INTO users(email) VALUES('test@gmail.com'),('test@outlook.com');`;

    // join_us_db.run(q, (err) => {
    //     if (err) {
    //         return console.error(err.message);
    //     }
    //     console.log('Success. (・ω・)');
    // });

    // let person = generateFakePersonData();

    // join_us_db.run(`INSERT INTO users(email, created_at) VALUES(?, ?);`, [person.email, person.created_at], function(err, result) {
    //     if (err) {
    //         throw err;
    //     }
    //     console.log(result);
    // });

    let people = generateFakeData();
    people.map((person) => {
        join_us_db.run(`INSERT INTO users(email, created_at) VALUES(?, ?)`, person, function(err, result) {
            if (err) {
                throw err;
            }
            console.log(result);
        });
    });

    q = `SELECT * FROM users;`;

    join_us_db.all(q, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            console.log(row.email + ' ' + row.created_at);
        });
    });

    q = `SELECT COUNT(*) AS total FROM users`;

    join_us_db.all(q, [], (err, results) => {
        if (err) {
            throw err;
        }
        results.forEach((row) => {
            console.log(row.total);
        });
    });

    join_us_db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Database connection closed. (・ω・)');
    });
})
