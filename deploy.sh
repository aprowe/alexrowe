DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Cleaning build folder..."
rm -r "$DIR/dist/"

echo "Compiling..."
npm run build

echo "Uploading to alexrowe.net..."
rsync -avh "$DIR/dist/" alexrowe@docs.alexrowe.net:~/home/ 

echo "Building node modules..."
ssh alexrowe@docs.alexrowe.net "cd ~/home/ && npm install --production"
ssh alexrowe@docs.alexrowe.net "cd ~/home/ && mkdir public"
ssh alexrowe@docs.alexrowe.net "cd ~/home/ && mkdir tmp"
ssh alexrowe@docs.alexrowe.net "cd ~/home/tmp && touch restart.txt"

echo "Complete!"
