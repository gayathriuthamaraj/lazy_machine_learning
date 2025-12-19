import Number from "./number"
import Dropdown from "./dropdown"

export default function Container() {
    return (
        <div className="flex justify-center-safe items-center-safe min-h-screen min-w-screen select-none">
        <div className="border-2 rounded bg-primary-highlight border-primary-text pb-3 pt-10 px-5">
            <h1 className="text-xl font-semibold">Linear Regression</h1>
            <Dropdown id="fit_intercept" options={["True","False"]}/>
            <Dropdown id="copy_X" options={["True","False"]}/>
            <Number allowMax = {false} allowMin={true} min={-1} float={false} id="n_jobs"/>
            <Dropdown id="positive" options={["True","False"]}/>
        </div>
        </div>
    )
}