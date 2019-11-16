# DHIS2 - Case 4 - Group project (2019)

## Prerequisite

- Bash or a terminal that can run `.sh`-scripts (Git on Windows will do!)

## How to install & run

Do:

```
> yarn install
> yarn start
```

##****NB!!****

Because of how DHIS2-app creation is built you have to do one extra step if you do not have any `.d2` files.

After you are done generating `.d2` files with `yarn start` or `yarn start --force`, you want to cancel the operation.

Then run `yarn start`, this will copy the necessary files to the generated `.d2` folder and everything will work like a charm (hopefully)!
 

-----
This will launch at `localhost:3000`.

We have created different users to simulate Karen and Frank. Use these users to operate with a realistic amount of facilites.

Use these values for Karen:
```
Server: https://debug.dhis2.org/2.32.1
Username: bert
Password: District9.
```
Use these values for Frank:
```
Server: https://debug.dhis2.org/2.32.1
Username: leif
Password: District9.
```
Use these values to test for cases with a huge amount of facilities:
```
Server: https://debug.dhis2.org/2.32.1
Username: bert2
Password: District9.
```

If you have any problems with `yarn start` try running `yarn start --force`.

PS! Your folders can't have spaces in them, you'll get a compiling error.

Happy coding!! :)))

## Style

To prettify all the js code in the project run `yarn run pretty`.

Commit also need to follow the standard of `type-of-commit(what-are-you-fixing): your message`

One example could be if I just implemented a feature the commit would be: `feat(cli-style): added dhis2 cli style to the project`

There is also commit hooks on the project so it will tell you if there is anything that you need to fix before you can commit.

## Our Trello board

https://trello.com/b/u0qHayVp/utvikling
