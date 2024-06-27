import { Octokit } from "octokit";
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const octokit = new Octokit({
  auth: "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",
});
export function getData(setDate) {
  const result = octokit
    .request("GET /repos/loremoredev/thirsty_tree/events", {
      owner: "loremoredev",
      repo: "thirsty_tree",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })
    .then((response) => {
      const data = response.data;
      const pushEventToMain = data.find(
        (push) =>
          push.type === "PushEvent" &&
          push.payload.ref === "refs/heads/TT-DV06-cypress"
      );
      const latestCommitDate = new Date(pushEventToMain.created_at)
        .toISOString()
        .split("T")[0];
      if (!pushEventToMain) {
        return 0;
      }

      setDate(latestCommitDate);
      return latestCommitDate;
    });
}
// const pushEvent =  data.find((event) => event.type === "PushEvent");
// if (!pushEvent) {
//   throw new Error("No push events found");
// }
// const branchName =  pushEvent.payload.ref.replace("refs/heads/", "");
// console.log(branchName);
// return branchName;

// const cypressEnv = {
//   branchName: branchName,
// };
// try {
//   preval`const fs = require(fs)
//     module.exports = fs.writeFileSync("cypress.env.json", ${"test"})`;
//   console.log("build success");
// } catch (err) {
//   console.error(err);
// }
