import * as fs from 'node:fs';
import * as http from 'node:http';
import * as path from 'node:path';

const PORT = 8000;

const STATIC_PATH = path.join(process.cwd(), './static');

const toBool = [() => true, () => false];
const dotInFileExtensionName = 1;

const MIME_TYPES = {
	default: 'application/octet-stream',
	html: 'text/html; charset=UTF-8',
	js: 'application/javascript; charset=UTF-8',
	css: 'text/css',
	png: 'image/png',
	jpg: 'image/jpg',
	gif: 'image/gif',
	ico: 'image/x-icon',
	svg: 'image/svg+xml',
};

const prepareFile = async url => {
	const paths = [STATIC_PATH, url];
	if (url.endsWith('/')) paths.push('index.html');

	const filePath = path.join(...paths);

	const pathTraversalAttempt = !filePath.startsWith(STATIC_PATH);
	const fileExists = await fs.promises.access(filePath).then(...toBool);
	const valid = !pathTraversalAttempt && fileExists;

	const streamPath = valid ? filePath : `${STATIC_PATH}/404.html`;
	const fileExtension = path.extname(streamPath).substring(dotInFileExtensionName).toLowerCase();
	const stream = fs.createReadStream(streamPath);

	return { valid, fileExtension, stream };
};

http
	.createServer(async (req, res) => {
		const { valid, fileExtension, stream } = await prepareFile(req.url);

		const statusCode = valid ? 200 : 404;
		const mimeType = MIME_TYPES[fileExtension] || MIME_TYPES.default;

		res.writeHead(statusCode, { 'Content-Type': mimeType });
		stream.pipe(res);

		console.log(`${req.method} ${req.url} ${statusCode}`);
	})
	.listen(PORT);

console.log(`Server is running at http://127.0.0.1:${PORT}/`);
