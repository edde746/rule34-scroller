<svelte:head>
  <title>Guide - hntai.lol</title>
  <meta
    name="description"
    content="Learn how to best search hntai.lol for the content you want to see the most"
  />
</svelte:head>

<div class="prose prose-invert">
  <h2 id="searching">Searching</h2>
  <h3 id="tags">Tags</h3>
  <ul>
    <li>
      <code>tag1 tag2</code>: Search for posts that have <code>tag1</code> and
      <code>tag2</code>.
    </li>
    <li>
      <code>( tag1 ~ tag2 )</code>: Search for posts that have <code>tag1</code>
      or <code>tag2</code>. <em>Note: The braces and spaces are important.</em>
    </li>
  </ul>
  <h3 id="fuzzy-search">Fuzzy Search</h3>
  <ul>
    <li>
      <code>night~</code>: Fuzzy search for the tag <code>night</code>. Returns
      results based on the Levenshtein distance.
    </li>
  </ul>
  <h3 id="excluding-tags">Excluding Tags</h3>
  <ul>
    <li>
      <code>-tag1</code>: Search for posts that don&#39;t have
      <code>tag1</code>.
    </li>
  </ul>
  <h3 id="wildcard-search">Wildcard Search</h3>
  <ul>
    <li>
      <code>ta*1</code>: Search for posts with tags that start with
      <code>ta</code>
      and end with <code>1</code>.
    </li>
  </ul>
  <h3 id="ratings">Ratings</h3>
  <ul>
    <li>
      <code>rating:questionable</code>: Search for posts that are rated
      questionable.
    </li>
    <li>
      <code>-rating:questionable</code>: Search for posts that are not rated
      questionable.
    </li>
  </ul>
  <h3 id="parent-posts">Parent Posts</h3>
  <ul>
    <li>
      <code>parent:1234</code>: Search for posts that have <code>1234</code> as
      a parent (includes post <code>1234</code>).
    </li>
  </ul>
  <h3 id="combining-metatags">Combining Metatags</h3>
  <ul>
    <li>
      <code>rating:questionable rating:safe</code>: Combining the same metatags
      usually does not work.
    </li>
    <li>
      <code>rating:questionable parent:100</code>: You can combine different
      metatags, however.
    </li>
  </ul>
  <h3 id="dimensions">Dimensions</h3>
  <ul>
    <li>
      <code>width:&gt;=1000 height:&gt;1000</code>: Find images with a width ≥
      1000 and a height &gt; 1000.
    </li>
  </ul>
  <h3 id="score">Score</h3>
  <ul>
    <li>
      <code>score:&gt;=10</code>: Find images with a score ≥ 10.
      <em>(Score is updated daily at 12AM CST)</em>.
    </li>
  </ul>
  <h2 id="sorting">Sorting</h2>
  <ul>
    <li>
      <code>sort:updated:desc</code>: Sort posts by their most recently updated
      order.
    </li>
  </ul>
  <h3 id="other-sortable-types">Other Sortable Types</h3>
  <ul>
    <li><code>id</code></li>
    <li><code>score</code></li>
    <li><code>rating</code></li>
    <li><code>user</code></li>
    <li><code>height</code></li>
    <li><code>width</code></li>
    <li><code>parent</code></li>
    <li><code>source</code></li>
    <li>
      <code>updated</code>
      <ul>
        <li>
          Can be sorted by both <code>asc</code> (ascending) or
          <code>desc</code> (descending).
        </li>
      </ul>
    </li>
  </ul>
</div>
