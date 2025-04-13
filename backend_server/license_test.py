import gurobipy as gp
from gurobipy import GRB


def simple_optimization():
    # Create a new model
    model = gp.Model("license_test")
    # Suppress output if desired; remove if you want all messages
    model.Params.OutputFlag = 1

    # Create a single decision variable x with lower bound 0
    x = model.addVar(lb=0, name="x")

    # Set objective to minimize x
    model.setObjective(x, GRB.MINIMIZE)

    # Add a simple constraint: x must be at least 1
    model.addConstr(x >= 1, "c0")

    # Optimize the model – this step will trigger Gurobi to check the license.
    model.optimize()

    # If optimal, print the solution
    if model.status == GRB.OPTIMAL:
        print("Optimal objective value:", model.objVal)
    else:
        print("Optimization ended with status", model.status)


if __name__ == '__main__':
    simple_optimization()