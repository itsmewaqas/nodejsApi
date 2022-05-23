const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

app.use(require('./apis/routes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, (error) => {
    if (!error)
        console.log("Server is Successfully Running,  and App is listening on port " + PORT)
    else
        console.log("Error occured, server can't start", error);
}
);
