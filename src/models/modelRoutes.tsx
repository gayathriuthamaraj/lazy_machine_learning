import LinearRegression from "./LinearRegression";
import LogisticRegression from "./LogisticRegression";
import RidgeRegression from "./RidgeRegression";
import LassoRegression from "./LassoRegression";
import KNearestNeighbors from "./KNearestNeighbors";
import SupportVectorMachine from "./SupportVectorMachine";
import RandomForest from "./RandomForest";

export const modelRoutes = [
  { name: "Linear Regression", path: "/models/linear-regression", element: <LinearRegression /> },
{ name: "Logistic Regression", path: "/models/logistic-regression", element: <LogisticRegression /> },
{ name: "Ridge Regression", path: "/models/ridge-regression", element: <RidgeRegression /> },
{ name: "Lasso Regression", path: "/models/lasso-regression", element: <LassoRegression /> },
{ name: "K Nearest Neighbors", path: "/models/k-nearest-neighbors", element: <KNearestNeighbors /> },
{ name: "Support Vector Machine", path: "/models/support-vector-machine", element: <SupportVectorMachine /> },
{ name: "Random Forest", path: "/models/random-forest", element: <RandomForest /> },
];
