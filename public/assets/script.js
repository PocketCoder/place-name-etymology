mapboxgl.accessToken = 'pk.eyJ1IjoicG9ja2V0Y29kZXIiLCJhIjoiY2w1bGU4bXoyMGoyNzNkbzR4M2ppa3F4aCJ9.PlamXAcj9IM_sfe41NAv5g';
const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/pocketcoder/cl5r3x2gs008h15pcl12y7snh',
	center: [-1.131944, 52.634444], // [lng, lat]
	zoom: 7,
	projection: 'globe'
});

map.on('style.load', () => {
	centreOnUser();
});

function centreOnUser() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(success, error);
	}

	function error(e) {
		console.log(e);
	}

	function success(pos) {
		const lat = pos.coords.latitude;
		const lng = pos.coords.longitude;
		map.flyTo({
			center: [lng, lat]
		});
		new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
	}
}

let info = {};

map.on('mousemove', (e) => {
	const features = map.queryRenderedFeatures(e.point);
	const feat = features[0];
	if (feat === undefined || feat['id'] === undefined) {
		info = {
			name: '',
			local: '',
			class: '',
			type: '',
			disputed: false,
			id: 0
		};
		document.getElementById('js-name').innerText = 'Hover over a place name to find out more';
	} else {
		const prop = feat['properties'];
		info['name'] = prop['name'];
		info['local'] = prop['name_local'];
		info['class'] = prop['class'];
		info['type'] = prop['type'];
		info['disputed'] = prop['disputed'];
		info['id'] = features[0]['id'];

		document.getElementById('js-name').innerText = info['name'];
	}
	document.getElementById('js-local').innerText = info['local'];
	document.getElementById('js-class').innerText = info['class'];
	document.getElementById('js-type').innerText = info['type'];
});

map.on('click', (e) => {
	/**
	 * e.point = x, y of map
	 * e.lngLat
	 */
	const lng = e.lngLat['lng'],
		lat = e.lngLat['lat'];
	console.log(map.queryRenderedFeatures(e.point));
	let text = '<a href="#add" id="js-add">Add a new place</a>';
	if (info['name'] !== '') {
		text = info['name'];
	}
	new mapboxgl.Popup().setLngLat([lng, lat]).setHTML(text).addTo(map);
});
