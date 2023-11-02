const express = require("express");

const app = express();

const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: "http://localhost:9200" });

client
  .ping()
  .then(() => {
    console.log("Elasticsearch is running");
  })
  .catch((error) => {
    console.error("Elasticsearch is not running:", error.message);
  });

// cluster health
app.get("/cluster-health", async (req, res) => {
  try {
    const health = await client.cat.health({ format: "json" });

    res.send(health);
  } catch (error) {
    res.send(error.message);
  }
});

// listing nodes
app.get("/nodes", async (req, res) => {
  try {
    const nodeInfo = await client.cat.nodes({ format: "json" });
    return res.send(nodeInfo);
  } catch (error) {
    return res.send(error.message);
  }
});

// listing of indices

app.get("/indices", async (req, res) => {
  try {
    const indicesInfo = await client.cat.indices({ format: "json" });
    return res.send(indicesInfo);
  } catch (error) {
    return res.send(error.message);
  }
});

// checking the shard distribution

app.get("/shards", async (req, res) => {
  try {
    const shardInfo = await client.cat.shards({ format: "json" });
    return res.send(shardInfo);
  } catch (error) {
    res.send(error.message);
  }
});

// create index

// app.get("/create-index", async (req, res) => {
//   const createdIndex = await client.indices.create({
//     index: "userlove",
//     mappings: {
//       {
//         properties: {
//           "browser": {
//             "type": "text",
//             "fields": {
//               "keyword": {
//                 "type": "keyword",
//                 "ignore_above": 256
//               }
//             }
//           },
//           "browser_language": {
//             "type": "keyword"
//           },
//           "channel": {
//             "type": "keyword"
//           },
//           "city": {
//             "type": "text",
//             "fields": {
//               "keyword": {
//                 "type": "keyword",
//                 "ignore_above": 256
//               }
//             }
//           },
//           "continent": {
//             "type": "text",
//             "fields": {
//               "keyword": {
//                 "type": "keyword",
//                 "ignore_above": 256
//               }
//             }
//           },
//           "country": {
//             "type": "text",
//             "fields": {
//               "keyword": {
//                 "type": "keyword",
//                 "ignore_above": 256
//               }
//             }
//           },
//           "currency": {
//             "type": "keyword"
//           },
//           "device_type": {
//             "type": "keyword"
//           },
//           "domain": {
//             "type": "text",
//             "fields": {
//               "keyword": {
//                 "type": "keyword",
//                 "ignore_above": 256
//               }
//             }
//           },
//           "domain_id": {
//             "type": "keyword"
//           },
//           "email": {
//             "type": "text",
//             "fields": {
//               "keyword": {
//                 "type": "keyword",
//                 "ignore_above": 256
//               }
//             }
//           },
//           "ended_at": {
//             "type": "date"
//           },
//           "entrance_page_url": {
//             "type": "text"
//           },
//           "event_tracking_id": {
//             "type": "keyword"
//           },
//           "exit_page_url": {
//             "type": "text"
//           },
//           "feature_progress.at": {
//             "type": "date"
//           },
//           "feature_progress.count": {
//             "type": "long"
//           },
//           "feature_progress.id": {
//             "type": "keyword"
//           },
//           "feature_progress.status": {
//             "type": "keyword"
//           },
//           "feature_progress.type": {
//             "type": "keyword"
//           },
//           "first_seen_at": {
//             "type": "date"
//           },
//     },

//     },
//     settings: {
//       number_of_replicas: 0,
//       number_of_shards: 1,
//     },
//   });

//   return res.send(createdIndex);
// });

// insert data into userlove index

app.get("/insert", async (req, res) => {
  try {
    const insertedData = await client.index({
      index: "userlove",
      id: 2,
      document: {
        channel: "shareablelink",
        domain_id: "213",
      },
    });
    return res.send(insertedData);
  } catch (error) {
    return res.send(error.message);
  }
});
// insert odd data in userlove

app.get("/insert-odd", async (req, res) => {
  try {
    const insertedData = await client.index({
      index: "userlove",
      id: 3,
      document: {
        channel: "mychannel",
        somethingelse: "sljfds",
      },
    });
    return res.send(insertedData);
  } catch (error) {
    return res.send(error.message);
  }
});
app.get("/mapping/:index", async (req, res) => {
  try {
    const mappingInfo = await client.indices.getMapping({
      index: "userlove",
      format: "json",
    });
    return res.send(mappingInfo);
  } catch (error) {
    return res.send(error.message);
  }
});

app.get("/search/:query", async (req, res) => {
  const searchResult = await client.search({
    query: {
      match_all: {},
    },
  });

  return res.send(searchResult);
});

app.get("/mapping", async (req, res) => {
  try {
    const productIndex = await client.indices.create({
      index: "userlove_tenant",
      mappings: {
        strict: true,
        properties: {
          channel: {
            type: "keyword",
          },
          domain_id: {
            type: "keyword",
          },
        },
      },
      settings: {
        number_of_replicas: 0,
        number_of_shards: 1,
      },
    });

    console.log("pinfo==>", productIndex);
    return res.send(productIndex);
  } catch (error) {
    return res.send(error);
  }
});

app.get("/insert/producs", async (req, res) => {
  try {
    const insertedData = await client.index({
      index: "productss",
      id: 10,
      document: {
        somethingelse: "shareablelink",
        domain_id: "213",
      },
    });
    return res.send(insertedData);
  } catch (error) {
    return res.send(error.message);
  }
});

app.get("/insert/userlove_tenant", async (req, res) => {
  try {
    const insertedData = await client.index({
      index: "userlove_tenant",
      id: 2,
      document: {
        browser: "chrome",
        channel: "shareablelink",
        feature_progress: {
          // yesterday date
          at: "2020-12-01",
          count: 1,
          id: "feature_id",
          status: "started",
        },
      },
    });
    return res.send(insertedData);
  } catch (error) {
    return res.send(error.message);
  }
});

app.get("/g", async (req, res) => {
  try {
    const getAllData = await client.search({
      index: "userlove_tenant",
      body: {
        query: {
          range: {
            "feature_progress.at": {
              lte: "2020-11-01",
            },
          },
        },
      },
    });
    return res.send(getAllData);
  } catch (error) {
    return res.send(error.message);
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
