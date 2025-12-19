import LinearRegression from "./LinearRegression";
import LogisticRegression from "./LogisticRegression";
import RidgeRegression from "./RidgeRegression";
import LassoRegression from "./LassoRegression";
import KNearestNeighbors from "./KNearestNeighbors";
import SupportVectorMachine from "./SupportVectorMachine";
import RandomForest from "./RandomForest";

export default function CallMain() {
  return (
    <div className="space-y-10">
      <LinearRegression /><LogisticRegression /><RidgeRegression /><LassoRegression /><KNearestNeighbors /><SupportVectorMachine /><RandomForest />
    </div>
  );
}
