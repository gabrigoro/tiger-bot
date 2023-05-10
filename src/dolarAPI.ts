import fetch from 'node-fetch'

export default function getDolarValue(): Promise<number> {
	return fetch('https://api.bluelytics.com.ar/v2/latest')
		.then((res) => res.json())
		.then((res: any) => res.blue.value_sell)
}
