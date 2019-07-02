#! /usr/bin/env python3
import os
import shutil

os.system("npx webpack")

srcroot = "./src/"
distroot = "./dist/"
xslroot = "./dist_xsl/"


def encode_dist(fname):
    fin = open(distroot+fname)
    fout = open(xslroot+fname+'.xml', 'w')
    fout.write('<text><![CDATA[')
    fout.write(fin.read())
    fout.write(']]></text>')
    fin.close()
    fout.close()


def copy_src(fname):
    shutil.copyfile(srcroot+fname, xslroot+fname)

def encode_src(fname):
    shutil.copyfile(srcroot+fname, distroot+fname)
    encode_dist(fname)

encode_dist('index.js')
encode_src('index.css')
copy_src('index.xslt')
