module.exports = function (shipit) {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    default: {
      workspace: __dirname + '/dist',
      deployTo: '/home/alexrowe/site',
      // repositoryUrl: 'https://github.com/user/repo.git',
      // ignores: ['.git', 'node_modules'],
      rsync: ['--del'],
      keepReleases: 2,
      key: `${process.env.HOME}/.ssh/id_rsa.pub`,
      shallowClone: true,
      servers: 'alexrowe@alexrowe.net'
    }
  });
};
