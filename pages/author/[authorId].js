import Head from 'next/head';
import Error from 'next/error';
import { useRouter } from 'next/router';
import { getGamesForAuthor } from '../../clients/pageGenerator';
import { GamesGrid } from '../../components/GamesGrid';
import { GeneratedFooter } from '../../components/GeneratedFooter';
import { Heading, Box } from '../../components/primitives';

export default function GamesGallery({ title, pageTitle, posts, generated }) {
	const router = useRouter();

	if (router.isFallback) {
		return (
			<Box paddingY={6} textAlign="center">
				Loading...
			</Box>
		);
	}

	if (!posts.length) {
		return <Error statusCode={404} />;
	}

	return (
		<Box>
			<Head>
				{pageTitle && <title>{pageTitle}: games gallery</title>}
			</Head>
			<Heading margin={3} marginTop={4}>
				{title}
			</Heading>
			<GamesGrid posts={posts} />
			<GeneratedFooter generated={generated} />
		</Box>
	);
}

export async function getStaticProps({ params }) {
	const { authorId } = params;

	const parsedId = parseInt(authorId, 10);
	const posts = !isNaN(parsedId) ? await getGamesForAuthor(parsedId) : [];
	const title = posts.length ? `Games by ${posts[0].author}` : null;
	const pageTitle = posts.length ? posts[0].author : null;

	return {
		props: {
			title,
			pageTitle,
			posts,
			generated: new Date().toISOString(),
		},
		revalidate: 30,
	};
}

export async function getStaticPaths() {
	return {
		paths: [],
		fallback: true,
	};
}
