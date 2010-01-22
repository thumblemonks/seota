(ns thumblemonks.page
  (:require [clojure.contrib.duck-streams :as d])
  (:import (java.net.URL))
)

(defn load [url]
  (d/read-lines (.openStream (URL. url)))
)

