import { RateLimit } from 'async-sema';

const discourseBaseURL = 'https://forum.makecode.com';
const fetchOptions = {
	headers: {
		Accept: 'application/json',
	},
};

// EXPECT: path is already properly encoded
export async function fetchArbitraryDiscourseResults(path) {
	return fetchWithRateLimit(`${discourseBaseURL}/${path}`, fetchOptions);
}

export async function fetchPostsForTopic(topicId) {
	return fetchWithRateLimit(`${makeTopicLink(topicId)}/posts`, fetchOptions);
}

// flag: one of ["all", "yearly", "quarterly", "monthly", "weekly", "daily"]
// order: one of ["default", "created", "activity", "views", "posts", "category", "likes", "op_likes", "posters"]
export async function fetchTopTopicsWithGameTag(flag, order) {
	// prettier-ignore
	return fetchWithRateLimit(
		`${discourseBaseURL}/top/${encodeURIComponent(flag)}?order=${encodeURIComponent(order)}&tags%5B%5D=game`,
		fetchOptions
	);
}

// order: one of ["default", "created", "activity", "views", "posts", "category", "likes", "op_likes", "posters"]
export async function fetchLatestTopicsWithGameTag(order) {
	// prettier-ignore
	return fetchWithRateLimit(
		`${discourseBaseURL}/latest?order=${encodeURIComponent(order)}&tags%5B%5D=game`,
		fetchOptions
	);
}

export function makeTopicLink(topicId) {
	return `${discourseBaseURL}/t/${encodeURIComponent(topicId)}`;
}

// stay under Discourse's rate limit; intentionally sharing RateLimit instance
async function fetchWithRateLimit(path, options) {
	await limit();
	return fetch(path, options);
}

const limit = new RateLimit(20, { timeUnit: 10 * 1000 });
