export default function Lab1() {
    return (
        <div id="wd-lab1">
            <h2>Lab 1</h2>
            <h3>HTML Examples</h3>
            <div id="wd-h-tag">
                <h4>Heading Tags</h4>
                Text documents are often broken up into several sections and subsections.
                Each section is usually prefaced with a short title or heading that attempts to summarize the topic of the section it precedes.
                For instance this paragraph is preceded by the heading Heading Tags.
                The font of the section headings are usually larger and bolder than the plain text and their subsection headings.
                This document uses headings to introduce topics such as HTML Documents, HTML Tags, Heading Tags, etc.
                HTML heading tags can be used to format plain text so that it renders in a browser as large headings.
                There are 6 heading tags for different sizes: h1, h2, h3, h4, h5, and h6. Tag h1 is the largest heading and h6 is the smallest heading.
            </div>
            <div id="wd-p-tag">
                <h4>Paragraph Tag</h4>
                <p id="wd-p-1">
                    This is a paragraph.
                    We often separate a long set of sentences with vertical spaces to make the text easier to read.
                    Browsers ignore vertical white spaces and render all the text as one single set of sentences.
                    To force the browser to add vertical spacing, wrap the paragraphs you want to separate with the paragraph tag.
                </p>
                <p id="wd-p-2">
                    This is the first paragraph.
                    The paragraph tag is used to format vertical gaps between long pieces of text like this one.
                </p>
                <p id="wd-p-3">
                    This is the second paragraph.
                    Even though there is a deliberate white gap between the paragraph above and this paragraph, by default the browsers render them as one contiguous piece of text as shown here on the right.
                </p>
                <p id="wd-p-4">
                    This is the third paragraph.
                    Wrap each paragraph with the paragraph tag to tell browsers to render the gaps.
                </p>
            </div>
            <div id="wd-lists">
                <h4>List Tags</h4>
                <h5>Ordered List Tag</h5>
                How to make pancakes:
                <ol id="wd-pancakes">
                    <li>Mix dy ingredients.</li>
                    <li>Add wet ingredients.</li>
                    <li>Stir to combine.</li>
                    <li>Heat a skillet or griddle.</li>
                    <li>Pour batter onto the skillet.</li>
                    <li>Cook until bubbly on top.</li>
                    <li>Flip and cook the other side.</li>
                    <li>Serve and enjoy!</li>
                </ol>
                My favorite recipe (Burnt Basque Cheesecake Bon Appetit recipe):
                <ol id="wd-your-favorite-recipe">
                    <li>Place a rack in middle of oven; preheat to 400°. Brush pan with unsalted butter, then line with 2 overlapping 16x12" sheets of parchment paper, making sure parchment comes at least 2" above top of pan on all sides. Because the parchment needs to be pleated and creased in some areas to fit in pan, you won’t end up with a clean, smooth outer edge to the cake; that’s okay! Place pan on a rimmed baking sheet.</li>
                    <li>Beat 2 lb. cream cheese, room temperature, and 1½ cups (300 g) sugar in the bowl of a stand mixer fitted with the paddle attachment on medium-low speed, scraping down sides of the bowl, until very smooth, no lumps remain, and sugar has dissolved, about 2 minutes. (You can also use a large bowl with a hand mixer on medium low-speed, but you may need to continue beating for a few extra minutes to dissolve sugar.)</li>
                    <li>Increase speed to medium and add 6 large eggs, one egg at a time, beating until each egg is incorporated, about 15 seconds, before adding the next. Scrape down sides of bowl, then reduce mixer speed to medium-low. Add 2 cups heavy cream, 1 tsp. Diamond Crystal or ½ tsp. Morton kosher salt, and 1 tsp. vanilla extract and beat until combined, about 30 seconds.</li>
                    <li>Turn off mixer and sift ⅓ cup (42 g) all-purpose flour evenly over cream cheese mixture using a fine-mesh sieve. Beat on low speed until incorporated, about 15 seconds. Scrape down sides of the bowl (yet again) and continue to beat until batter is very smooth, homogenous, and silky, about 10 seconds.</li>
                    <li>Pour batter into prepared pan. Bake cheesecake until deeply golden brown on top and still very jiggly in the center, 60–65 minutes.</li>
                    <li>Let cool slightly (cake will collapse drastically as it cools), then unmold. Let cool completely. Carefully peel away parchment from sides of cheesecake. Slice into wedges and serve at room temperature, preferably with a glass of sherry alongside.</li>
                </ol>
                <h5>Unordered List Tag</h5>
                My favorite books (in no particular order)
                <ul id="wd-my-books">
                    <li>Dune</li>
                    <li>Lord of the Rings</li>
                    <li>Ender's Game</li>
                    <li>Red Mars</li>
                    <li>The Forever War</li>
                </ul>
                Your favorie books (in no particular order)
                <ul id="wd-your-books">
                    <li>The Last Lecture</li>
                    <li>Atlas Shrugged</li>
                    <li>Fearless</li>
                    <li>Band of Brothers</li>
                </ul>
            </div>
            <div id="wd-tables">
                <h4>Table Tag</h4>
                <table border={1} width="100%">
                    <thead>
                        <tr>
                            <th>Quiz</th>
                            <th>Topic</th>
                            <th>Date</th>
                            <th>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Q1</td>
                            <td>HTML</td>
                            <td>2/3/21</td>
                            <td>85</td>
                        </tr>
                        <tr>
                            <td>Q2</td>
                            <td>CSS</td>
                            <td>2/10/21</td>
                            <td>90</td>
                        </tr>
                        <tr>
                            <td>Q3</td>
                            <td>JavaScript</td>
                            <td>2/17/21</td>
                            <td>95</td>
                        </tr>
                        <tr>
                            <td>Q4</td>
                            <td>React</td>
                            <td>2/24/21</td>
                            <td>95</td>
                        </tr>
                        <tr>
                            <td>Q5</td>
                            <td>TypeScript</td>
                            <td>3/3/21</td>
                            <td>93</td>
                        </tr>
                        <tr>
                            <td>Q6</td>
                            <td>Apache Spark</td>
                            <td>3/10/21</td>
                            <td>87</td>
                        </tr>
                        <tr>
                            <td>Q7</td>
                            <td>Tailwind CSS</td>
                            <td>3/17/21</td>
                            <td>95</td>
                        </tr>
                        <tr>
                            <td>Q8</td>
                            <td>Mongo DB</td>
                            <td>3/24/21</td>
                            <td>95</td>
                        </tr>
                        <tr>
                            <td>Q9</td>
                            <td>Next JS</td>
                            <td>3/31/21</td>
                            <td>90</td>
                        </tr>
                        <tr>
                            <td>Q10</td>
                            <td>Full Stack Development</td>
                            <td>4/7/21</td>
                            <td>95</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={3}>Average</td>
                            <td>92</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div id="wd-images">
                <h4>Image tag</h4>
                Loading an image from the internet:
                <br />
                <img id="wd-starship"
                    width="400px"
                    src="https://www.staradvertiser.com/wp-content/uploads/2021/08/web1_Starship-gap2.jpg"
                />
                <br />
                Loading a local image:
                <br />
                <img id="wd-teslabot" src="images/teslabot.jpeg" height="200px" />
            </div>
            <div id="wd-forms">
                <h4>Form Elements</h4>
                <form id="wd-text-fields">
                    <h5>Text Fields</h5>
                    <label htmlFor="wd-text-fields-username">Username:</label>
                    <input id="wd-text-fields-username" placeholder="jdoe" /> <br />
                    <label htmlFor="wd-text-fields-password">Password:</label>
                    <input type="password" id="wd-text-fields-password" value="123@#$asd" />
                    <br />
                    <label htmlFor="wd-text-fields-first-name">First name:</label>
                    <input type="text" id="wd-text-fields-first-name" title="John" /> <br />
                    <label htmlFor="wd-text-fields-last-name">Last name:</label>
                    <input type="text" id="wd-text-fields-last-name" placeholder="Doe"
                        value="Wonderland" title="The last name" />

                    <h5>Text boxes</h5>
                    <label>Biography:</label><br />
                    <textarea id="wd-textarea" cols={30} rows={10}>"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"</textarea>

                    <h5 id="wd-buttons">Buttons</h5>
                    <button id="wd-all-good" onClick={() => alert("Life is Good!")} type="button">
                        Hello World!
                    </button>

                    <h5>File Upload</h5>
                    <input id="wd-upload" type="file" />

                    <h5 id="wd-radio-buttons">Radio buttons</h5>

                    <label>Favorite movie genre:</label><br />

                    <input type="radio" name="radio-genre" id="wd-radio-comedy" />
                    <label htmlFor="wd-radio-comedy">Comedy</label> <br />

                    <input type="radio" name="radio-genre" id="wd-radio-drama" />
                    <label htmlFor="wd-radio-drama">Drama</label> <br />

                    <input type="radio" name="radio-genre" id="wd-radio-scifi" />
                    <label htmlFor="wd-radio-scifi">Science Fiction</label> <br />

                    <input type="radio" name="radio-genre" id="wd-radio-fantasy" />
                    <label htmlFor="wd-radio-fantasy">Fantasy</label> <br />


                    <h5 id="wd-checkboxes">Checkboxes</h5>

                    <label>Favorite movie genre:</label><br />

                    <input type="checkbox" name="check-genre" id="wd-chkbox-comedy" />
                    <label htmlFor="wd-chkbox-comedy">Comedy</label> <br />

                    <input type="checkbox" name="check-genre" id="wd-chkbox-drama" />
                    <label htmlFor="wd-chkbox-drama">Drama</label> <br />

                    <input type="checkbox" name="check-genre" id="wd-chkbox-scifi" />
                    <label htmlFor="wd-chkbox-scifi">Science Fiction</label> <br />

                    <input type="checkbox" name="check-genre" id="wd-chkbox-fantasy" />
                    <label htmlFor="wd-chkbox-fantasy">Fantasy</label> <br />

                    <h4>Other HTML field types</h4>

                    <label htmlFor="wd-text-fields-email"> Email: </label>
                    <input type="email"
                        placeholder="jdoe@somewhere.com"
                        id="wd-text-fields-email" /><br />

                    <label htmlFor="wd-text-fields-salary-start"> Starting salary:
                    </label>
                    <input type="number"
                        id="wd-text-fields-salary-start"
                        placeholder="1000"
                        value="100000" /><br />

                    <label htmlFor="wd-text-fields-rating"> Rating: </label>
                    <input type="range" id="wd-text-fields-rating"
                        placeholder="Doe"
                        max="5"
                        value="4" /><br />

                    <label htmlFor="wd-text-fields-dob"> Date of birth: </label>
                    <input type="date"
                        id="wd-text-fields-dob"
                        value="2000-01-21" /><br />
                </form>

                <h4 id="wd-dropdowns">Dropdowns</h4>
                <h5>Select one</h5>
                <label htmlFor="wd-select-one-genre"> Favorite movie genre: </label><br />
                <select id="wd-select-one-genre">
                    <option value="COMEDY">Comedy</option>
                    <option value="DRAMA">Drama</option>
                    <option selected value="SCIFI">
                        Science Fiction</option>
                    <option value="FANTASY">Fantasy</option>
                </select>

                <h5>Select many</h5>
                <label htmlFor="wd-select-many-genre"> Favorite movie genres: </label><br />
                <select id="wd-select-many-genre" multiple>
                    <option selected value="COMEDY">Comedy</option>
                    <option value="DRAMA">Drama</option>
                    <option selected value="SCIFI">
                        Science Fiction</option>
                    <option value="FANTASY">Fantasy</option>
                </select>
                <h4>Anchor tag</h4>
                Please
                <a id="wd-lipsum" href="https://www.lipsum.com">click here</a>
                to get dummy text<br />
            </div>
        </div>
    );
}
