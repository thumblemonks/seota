set :to,          ENV['to'] || 'production'
set :application, "seota"
set :revision,    ENV['REV'] || 'origin/master'
set :timestamp,   Time.now.strftime("%Y%m%d%H%M%S")

# Define the following in a file, like _deploy/production.rb
# set :repository,  "git://github.com/#{user}/seota.git"
# set :deploy_to,   "/path/to/#{application}"
# host 'user@hostname', :db, :app
require "deploy/#{to}"

#
# Routine tasks

namespace :deploy do
  remote_task :symlink_configs, :roles => :app do
    tracking_path = "public/javascripts/tracking.js"
    run "ln -nfs #{shared_path}/#{tracking_path} #{latest_release}/#{tracking_path}"
  end
end

remote_task 'vlad:update_symlinks', :roles => :app do
  Rake::Task['deploy:symlink_configs'].invoke
end

desc "Deploys the latest set of code (use this most often)"
task 'vlad:deploy' => ['vlad:update', 'vlad:cleanup']

#
# One time tasks

remote_task 'vlad:setup_app', :roles => :app do
  # run "mkdir #{shared_path}/something"
end
