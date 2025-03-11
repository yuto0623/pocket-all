export default function Card() {
	return (
		<div className="card card-border">
			<div className="card-body">
				<h2 className="card-title">
					test Card
					{/* <div className="badge badge-neutral">Primary</div> */}
				</h2>
				<p>testsetstestse</p>
				<div className="justify-end card-actions">
					<button type="button" className="btn btn-primary">
						Buy Now
					</button>
				</div>
			</div>
		</div>
	);
}
