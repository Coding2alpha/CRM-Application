const buildQuery = (req, res, next) => {
  const { criteria } = req.body;
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

  if (criteria.visits) {
    if (criteria.visitsCondition === "greaterThan") {
      conditions.push({ visits: { $gt: parseInt(criteria.visits) } });
    } else if (criteria.visitsCondition === "lessThan") {
      conditions.push({ visits: { $lt: parseInt(criteria.visits) } });
    } else if (criteria.visitsCondition === "equalTo") {
      conditions.push({ visits: { $eq: parseInt(criteria.visits) } });
    }
  }

  if (criteria.months) {
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
  }

  let query;
  if (criteria.logic === "OR") {
    query = { $or: conditions };
  } else if (criteria.logic === "AND") {
    query = { $and: conditions };
  } else if (criteria.logic === "CUSTOM") {
    query = buildCustomQuery(conditions, criteria.customLogic);
  }

  req.query = { query };
  next();
};

const buildCustomQuery = (conditions, customLogic) => {
  const customQuery = {};

  // Parse the custom logic to get the order of indices and operators
  const parts = customLogic.split(" ");
  const indices = parts.filter((part) => !isNaN(parseInt(part))).map(Number);
  const operators = parts.filter((part) => isNaN(parseInt(part)));

  // Reorder the conditions array based on the custom logic
  const reorderedConditions = indices.map((index) => conditions[index]);

  if (reorderedConditions.length < 3 || operators.length < 2) {
    throw new Error("Custom logic must contain 3 conditions and 2 operators.");
  }

  // Build the query using the first operator between the first two conditions
  let intermediateResult;
  if (operators[0] === "AND") {
    intermediateResult = {
      $and: [reorderedConditions[0], reorderedConditions[1]],
    };
  } else if (operators[0] === "OR") {
    intermediateResult = {
      $or: [reorderedConditions[0], reorderedConditions[1]],
    };
  }
  // console.log(intermediateResult);
  // Apply the second operator between the intermediate result and the third condition
  if (operators[1] === "AND") {
    customQuery.$and = [intermediateResult, reorderedConditions[2]];
  } else if (operators[1] === "OR") {
    customQuery.$or = [intermediateResult, reorderedConditions[2]];
  }
  // console.log(customQuery);
  return customQuery;
};

module.exports = buildQuery;
