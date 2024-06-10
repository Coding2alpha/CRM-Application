const buildQuery = (req, res, next) => {
  const { criteria } = req.body;
  // console.log(criteria);
  const conditions = [];

  if (criteria.totalSpends) {
    if (criteria.totalSpendsCondition === "greaterThan") {
      conditions.push({
        total_spends: { $gt: parseInt(criteria.totalSpends) },
      });
    } else if (criteria.totalSpendsCondition === "lessThan") {
      conditions.push({
        total_spends: { $lt: parseInt(criteria.totalSpends) },
      });
    }
  }

  // Handle visits with condition
  if (criteria.visits) {
    console.log(criteria.visits);
    if (criteria.visitsCondition === "greaterThan") {
      conditions.push({ visits: { $gt: parseInt(criteria.visits) } });
    } else if (criteria.visitsCondition === "lessThan") {
      conditions.push({ visits: { $lt: parseInt(criteria.visits) } });
    } else if (criteria.visitsCondition === "equalTo") {
      conditions.push({ visits: { $eq: parseInt(criteria.visits) } });
    }
  }

  if (criteria.visitStatus === "visitedInLastMonth") {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    conditions.push({ last_visit: { $gte: date } });
  } else if (
    criteria.visitStatus === "notVisitedInLastMonths" &&
    criteria.months !== ""
  ) {
    const date = new Date();
    date.setMonth(date.getMonth() - parseInt(criteria.months));
    conditions.push({ last_visit: { $lt: date } });
  }

  let query;
  if (criteria.logic === "OR") {
    query = { $or: conditions };
  } else if (criteria.logic === "AND") {
    query = { $and: conditions };
  } else if (criteria.logic === "CUSTOM") {
    // Custom combination logic handling
    query = buildCustomQuery(conditions, criteria.customLogic);
  }

  req.query = { query };
  next();
};

const buildCustomQuery = (conditions, customLogic) => {
  const customQuery = { $and: [] };
  // console.log(typeof customLogic);

  if (customLogic.includes("AND")) {
    const andConditions = customLogic
      .split("AND")
      .map((index) => conditions[parseInt(index)]);
    customQuery.$and.push({ $and: andConditions });
  } else if (customLogic.includes("OR")) {
    const orConditions = customLogic
      .split("OR")
      .map((index) => conditions[parseInt(index)]);
    customQuery.$and.push({ $or: orConditions });
  }
  // console.log(customQuery);
  return customQuery;
};

module.exports = buildQuery;
