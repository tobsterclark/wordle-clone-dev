import { useCookies } from "react-cookie";

const Statistics = () => {
	const [cookies] = useCookies();
	return (
		<div className="flex flex-col gap-10">
			<div className="flex flex-col">
				<span className="font-black text-2xl">Statistics</span>
				<div className="flex justify-center gap-x-10">
					<div className="flex flex-col">
						<span>{cookies.wins ? cookies.wins : 0}</span>
						<span>Win</span>
					</div>
					<div className="flex flex-col">
						<span>{cookies.percent ? cookies.percent : 0}%</span>
						<span>Win Avg</span>
					</div>
					<div className="flex flex-col">
						<span>{cookies.total ? cookies.total : 0}</span>
						<span>Total</span>
					</div>
				</div>
			</div>
			<div className="font-black text-2xl">Average score</div>
		</div>
	);
};

export default Statistics;
