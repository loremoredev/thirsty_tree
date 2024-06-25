const jsonString = {
  ctRoot: [
    {
      _id: "FUNMA6Q0VCNQIYPO",
      name: "Jeane Muhammad",
      dob: "2015-05-29",
      address: {
        street: "6887 Irvine Road",
        town: "Mexborough",
        postode: "PR09 5YR",
      },
      telephone: "+212-6919-387-694",
      pets: ["Cali", "Oliver"],
      score: 2.1,
      email: "vannesa-crook0@sofa.com",
      url: "http://www.backed.com",
      description:
        "considered preparing decide lit etc depression downloading bra keep rose ru hotels nurses styles soa supposed guess judges disciplines resistance",
      verified: true,
      salary: 64370,
    },
    {
      _id: "R3VAH6QLAI6LC3Y0",
      name: "Fawn Waters",
      dob: "2022-06-11",
      address: {
        street: "6158 Ledgard Circle",
        town: "Basingstoke",
        postode: "E85 8IT",
      },
      telephone: "+53-8208-009-605",
      pets: ["Kiki", "Emma"],
      score: 7,
      email: "suzan_obryan@hotmail.com",
      url: "http://agricultural.com",
      description:
        "urls jungle popularity magic david jp jade equilibrium amateur options ye virtual adjust anything wto weights gothic betting ecommerce moment",
      verified: true,
      salary: 32885,
    },
  ],
};
describe("Formatting test", () => {
  it("Visits the homepage", () => {
    cy.visit("thirsty-tree-6rar3h9eb-thirst-tree.vercel.app");

    cy.get(".editor").type(JSON.stringify(jsonString), {
      parseSpecialCharSequences: false,
    });
  });
});
