const criteriaToString = (req, res, next) => {
  const { criteria } = req.body;
  const conditions = [];

  if (criteria.totalSpends !== undefined && criteria.totalSpends !== "") {
    const totalSpendsCondition =
      criteria.totalSpendsCondition === "greaterThan"
        ? "greater than"
        : "less than";
    conditions.push(
      `Customers with total spends ${totalSpendsCondition} INR ${criteria.totalSpends}`
    );
  }

  if (criteria.visits !== undefined && criteria.visits !== "") {
    let visitsCondition;
    if (criteria.visitsCondition === "greaterThan") {
      visitsCondition = "greater than";
    } else if (criteria.visitsCondition === "lessThan") {
      visitsCondition = "less than";
    } else {
      visitsCondition = "equal to";
    }
    conditions.push(
      `Customers with number of visits ${visitsCondition} ${criteria.visits}`
    );
  }

  if (criteria.visitStatus === "visitedInLastMonth" && criteria.months !== "") {
    conditions.push(`Customers visited in last ${criteria.months} months`);
  } else if (
    criteria.visitStatus === "notVisitedInLastMonths" &&
    criteria.months !== ""
  ) {
    conditions.push(`Customers not visited in last ${criteria.months} months`);
  }

  if (criteria.logic === "CUSTOM" && criteria.customLogic !== "") {
    const customLogic = criteria.customLogic.split(" ");
    const customConditions = customLogic.map((logic) => {
      if (logic === "AND" || logic === "OR") {
        return logic;
      } else {
        // console.log(parseInt(logic), conditions[parseInt(logic)]);
        return conditions[parseInt(logic)];
      }
    });
    const audienceCriteria = customConditions.join(" ");
    req.audienceCriteria = audienceCriteria;
    next();
    return;
  }

  const audienceCriteria = conditions.join(" ");
  req.audienceCriteria = audienceCriteria;
  next();
};

module.exports = criteriaToString;
